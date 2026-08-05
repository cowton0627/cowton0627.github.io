#!/usr/bin/env node
/**
 * Sync content/**\/*.md to HackMD notes.
 *
 * Required env:
 *   HACKMD_API_TOKEN — personal access token from https://hackmd.io/settings/api
 *
 * Behavior:
 *   - First time a file is seen → POST /notes, save id+hash in mapping
 *   - Already mapped + content changed → PATCH the note
 *   - Already mapped + content unchanged → skip
 *   - Wikilinks resolve to https://cowton0627.github.io/... using Quartz's
 *     slug rule: spaces become "-", folders/Unicode preserved, trailing
 *     slash maps to /folder/index → /folder/
 *
 * Files removed from content/ are NOT auto-deleted from HackMD. Orphan
 * entries stay in mapping.json so re-adding the file keeps the same note;
 * delete the line by hand if you really want a fresh note.
 *
 * Usage:
 *   HACKMD_API_TOKEN=xxx node scripts/sync-hackmd.mjs
 *   node scripts/sync-hackmd.mjs --dry-run    # no API calls
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";

const CONTENT = "content";
const MAPPING_PATH = ".hackmd-sync/mapping.json";
const SITE_BASE = "https://cowton0627.github.io";
const API = "https://api.hackmd.io/v1";
const TOKEN = process.env.HACKMD_API_TOKEN;
const DRY = process.argv.includes("--dry-run");

if (!TOKEN && !DRY) {
  console.error(
    "HACKMD_API_TOKEN not set. Use --dry-run for a no-API preview.",
  );
  process.exit(1);
}

async function walk(dir, out = []) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue;
    const full = join(dir, ent.name);
    if (ent.isDirectory()) await walk(full, out);
    else if (ent.name.endsWith(".md")) out.push(full);
  }
  return out;
}

const mdFiles = (await walk(CONTENT)).sort();

const slugs = new Set();
for (const f of mdFiles) {
  slugs.add(relative(CONTENT, f).replace(/\.md$/, ""));
}
const byBasename = new Map();
for (const s of slugs) {
  const bn = s.split("/").pop();
  if (!byBasename.has(bn)) byBasename.set(bn, []);
  byBasename.get(bn).push(s);
}

const quartzSlug = (part) => part.replace(/ /g, "-");

function wikilinkToUrl(target) {
  const norm = target.endsWith("/") ? target + "index" : target;
  let resolved = null;
  if (slugs.has(norm)) resolved = norm;
  else if (!norm.includes("/") && byBasename.has(norm))
    resolved = byBasename.get(norm)[0];
  if (!resolved) return null;
  const parts = resolved.split("/").map(quartzSlug);
  if (parts[parts.length - 1] === "index") {
    parts.pop();
    return `${SITE_BASE}/${parts.join("/")}/`;
  }
  return `${SITE_BASE}/${parts.join("/")}`;
}

function convertWikilinks(text) {
  const lines = text.split("\n");
  let inCode = false;
  const warnings = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    lines[i] = lines[i].replace(/(?<!!)\[\[([^\]\n]+)\]\]/g, (m, inner) => {
      const [rawTarget, alias] = inner.split("|");
      const [target, anchor] = rawTarget.split("#");
      const url = wikilinkToUrl(target.trim());
      if (!url) {
        warnings.push(inner);
        return m;
      }
      const display = (alias ?? rawTarget).trim();
      return `[${display}](${anchor ? `${url}#${anchor}` : url})`;
    });
  }
  return { text: lines.join("\n"), warnings };
}

const hashOf = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);

async function api(method, path, body) {
  const r = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) {
    throw new Error(`${method} ${path} → ${r.status} ${await r.text()}`);
  }
  return r.status === 204 ? null : await r.json();
}

const mapping = await readFile(MAPPING_PATH, "utf8")
  .then(JSON.parse)
  .catch(() => ({}));

let created = 0,
  updated = 0,
  skipped = 0;
const allWarnings = [];

for (const f of mdFiles) {
  const raw = await readFile(f, "utf8");
  const { text: converted, warnings } = convertWikilinks(raw);
  const hash = hashOf(converted);
  if (warnings.length) allWarnings.push({ file: f, warnings });

  const entry = mapping[f];
  if (entry && entry.hash === hash) {
    skipped++;
    continue;
  }

  if (DRY) {
    console.log(`[dry] ${entry ? "update" : "create"}  ${f}`);
    if (entry) updated++;
    else created++;
    continue;
  }

  if (entry) {
    await api("PATCH", `/notes/${entry.id}`, { content: converted });
    mapping[f] = { id: entry.id, hash };
    updated++;
    console.log(`✓ updated  ${f}`);
  } else {
    const note = await api("POST", `/notes`, {
      content: converted,
      readPermission: "guest",
      writePermission: "owner",
      commentPermission: "signed_in_users",
    });
    mapping[f] = { id: note.id, hash };
    created++;
    console.log(`+ created  ${f} → ${note.id}`);
  }

  await new Promise((r) => setTimeout(r, 200));
}

if (!DRY) {
  await writeFile(MAPPING_PATH, JSON.stringify(mapping, null, 2) + "\n");
}

console.log(`\n${created} created, ${updated} updated, ${skipped} unchanged`);
if (allWarnings.length) {
  console.warn("\nUnresolved wikilinks (left as-is in HackMD):");
  for (const w of allWarnings) {
    console.warn(`  ${w.file}: ${w.warnings.join(", ")}`);
  }
}
