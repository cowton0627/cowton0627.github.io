#!/usr/bin/env node
/**
 * Verify every [[wikilink]] in content/**\/*.md resolves to an existing
 * markdown file. Mirrors Quartz's `markdownLinkResolution: "shortest"`:
 *
 *   [[Foo]]         → any file whose basename is Foo.md
 *   [[a/b/Foo]]     → content/a/b/Foo.md
 *   [[a/b/]]        → content/a/b/index.md  (trailing slash = folder hub)
 *   [[Foo|alias]]   → resolves Foo; alias is just display text
 *   [[Foo#section]] → resolves Foo; the #anchor isn't validated
 *
 * Skips:
 *   - fenced code blocks (```...```), where wikilinks are example syntax
 *   - image embeds ![[…]], which target asset files (out of scope here)
 *   - anchor-only [[#section]], which always means "this page"
 *
 * Exit code: 0 = all clean, 1 = found broken links.
 */

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const CONTENT = "content";

async function walk(dir, out = []) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) await walk(full, out);
    else if (ent.name.endsWith(".md")) out.push(full);
  }
  return out;
}

const mdFiles = await walk(CONTENT);

// slug = path-under-content with .md stripped — Quartz's convention
const slugs = new Set();
for (const f of mdFiles) {
  slugs.add(relative(CONTENT, f).replace(/\.md$/, ""));
}

// basename → list-of-full-slugs (for shortest resolution)
const byBasename = new Map();
for (const s of slugs) {
  const bn = s.split("/").pop();
  if (!byBasename.has(bn)) byBasename.set(bn, []);
  byBasename.get(bn).push(s);
}

function resolves(target) {
  if (!target) return true; // [[#heading]] — anchor-only
  const norm = target.endsWith("/") ? target + "index" : target;
  if (slugs.has(norm)) return true;
  if (!norm.includes("/") && byBasename.has(norm)) return true;
  return false;
}

const broken = [];
for (const f of mdFiles) {
  const text = await readFile(f, "utf8");
  const lines = text.split("\n");
  let inCode = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    // Match [[…]] but NOT ![[…]] (image embeds)
    const re = /(?<!!)\[\[([^\]\n]+)\]\]/g;
    let m;
    while ((m = re.exec(line)) !== null) {
      const inner = m[1];
      const target = inner.split("|")[0].split("#")[0].trim();
      if (!resolves(target)) {
        broken.push({
          file: relative(CONTENT, f),
          line: i + 1,
          col: m.index + 1,
          link: inner,
        });
      }
    }
  }
}

if (broken.length === 0) {
  console.log(
    `✓ All wikilinks resolve. (${mdFiles.length} markdown files scanned)`,
  );
  process.exit(0);
}

console.error(`✗ ${broken.length} broken wikilink(s):\n`);
for (const b of broken) {
  console.error(`  content/${b.file}:${b.line}:${b.col}  [[${b.link}]]`);
}
console.error("");
process.exit(1);
