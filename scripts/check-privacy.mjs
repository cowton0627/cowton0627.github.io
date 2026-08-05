#!/usr/bin/env node
/**
 * Scan content/**\/*.md for things that should not be on a public site:
 * personal identifiers, machine-local details, and credentials.
 *
 * Why this exists: an SEO note carried a real name written in styled
 * Unicode (𝐂𝗵𝐚𝗿𝗹𝗲𝘀, U+1D400 block) plus a wordpress subdomain that looked
 * like a phone number. Plain ASCII greps for the name found nothing —
 * the characters simply aren't the letters they look like. Structural
 * rules catch that class of leak; eyeballing does not.
 *
 * DESIGN CONSTRAINT — the scanner must not contain the secrets it hunts.
 * This file is tracked in a PUBLIC repo, so hardcoding a real name or
 * phone number here would leak exactly what it's meant to protect.
 * Every rule below is therefore a *shape* (a Unicode block, an email
 * grammar, an IP range), never a literal personal string. For patterns
 * that can only be expressed literally, put them in:
 *
 *     .privacy-patterns.local   (gitignored, one regex per line)
 *
 * Exit code: 0 = clean, 1 = findings.
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const CONTENT = "content";
const LOCAL_PATTERNS = ".privacy-patterns.local";

// Substrings that are deliberately public and would otherwise trip a rule.
// Keep this list short and justified — every entry is a hole in the net.
const ALLOW = [
  "medium.com/@cowton0517", // public Medium handle, used as byline
  "cowton0517.medium.com", // same handle, article links
  "git@github.com", // SSH remote syntax in Git tutorials
  "users.noreply.github.com", // the no-reply form is the safe one
  "yourMail@gmail.com", // placeholder used in tutorials
  "example.com",
  "example@example.com",
];

const RULES = [
  {
    id: "styled-unicode",
    // Math alphanumerics + fullwidth Latin. Legitimate prose never needs
    // these; they show up when text is pasted from decorated sources, and
    // they defeat ASCII greps for whatever the letters spell.
    re: /[\u{1D400}-\u{1D7FF}\u{FF21}-\u{FF3A}\u{FF41}-\u{FF5A}]+/gu,
    why: "花體/全形 Unicode 字母：可能是躲過一般 grep 的本名或商號",
  },
  {
    id: "personal-email",
    re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    why: "看起來是真實 email",
  },
  {
    id: "home-path",
    // /Users/foo or /home/foo — leaks the OS account name.
    re: /\/(?:Users|home)\/[A-Za-z0-9._-]+/g,
    why: "含使用者名的絕對路徑（用 ~ 取代）",
  },
  {
    id: "private-ip",
    // RFC1918 + CGNAT (100.64/10, what Tailscale hands out).
    re: /\b(?:10\.\d{1,3}|192\.168|172\.(?:1[6-9]|2\d|3[01])|100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7]))\.\d{1,3}\.\d{1,3}\b/g,
    why: "內網 / tailnet IP",
  },
  {
    id: "tw-mobile",
    // 09xx-xxx-xxx with optional separators, and the bare 9-digit tail
    // when glued to letters (the wordpress-subdomain shape).
    re: /\b09\d{2}[-\s]?\d{3}[-\s]?\d{3}\b|[A-Za-z]{2,}9[0-9]{8}\b/g,
    why: "疑似台灣手機號碼",
  },
  {
    id: "credential",
    // Real tokens, not shapes that merely look secret.
    re: /\b(?:ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{10,})/g,
    why: "看起來是真的憑證／token",
  },
  {
    id: "cloud-project-id",
    re: /\bgen-lang-client-\d{6,}\b/g,
    why: "真實 GCP 專案 ID",
  },
];

async function loadLocalRules() {
  let raw;
  try {
    raw = await readFile(LOCAL_PATTERNS, "utf8");
  } catch {
    return [];
  }
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((src, i) => ({
      id: `local:${i + 1}`,
      re: new RegExp(src, "gi"),
      why: "本機自訂樣式",
    }));
}

async function walk(dir, out = []) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) await walk(full, out);
    else if (ent.name.endsWith(".md")) out.push(full);
  }
  return out;
}

const rules = [...RULES, ...(await loadLocalRules())];
const files = await walk(CONTENT);
const findings = [];

for (const file of files) {
  const lines = (await readFile(file, "utf8")).split("\n");
  lines.forEach((line, i) => {
    for (const rule of rules) {
      rule.re.lastIndex = 0;
      for (const m of line.matchAll(rule.re)) {
        const hit = m[0];
        // Match against the hit itself, not the surrounding line: an
        // allowed substring elsewhere on the same line must not excuse an
        // unrelated leak next to it. `a.includes(hit)` covers partial
        // matches of an allowed string; `hit.includes(a)` covers the
        // noreply-email case, where the allowed domain is a suffix of a
        // longer legitimate address.
        if (ALLOW.some((a) => hit.includes(a) || a.includes(hit))) continue;
        findings.push({ file, line: i + 1, rule, hit });
      }
    }
  });
}

if (findings.length === 0) {
  console.log(
    `✓ No privacy leaks found. (${files.length} markdown files scanned)`,
  );
  process.exit(0);
}

console.error(`✗ ${findings.length} possible leak(s):\n`);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}`);
  console.error(`    [${f.rule.id}] ${f.rule.why}`);
  console.error(`    → ${f.hit}\n`);
}
console.error(
  "If a hit is deliberately public, add it to ALLOW in scripts/check-privacy.mjs\n" +
    "with a one-line reason. Do NOT add real personal strings to that list —\n" +
    "this file is public. Use .privacy-patterns.local for anything sensitive.",
);
process.exit(1);
