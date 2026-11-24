// One Sentence for a Traveler from 1800 — writes the entry sentence to /output/entry.txt.
// Node 22, stdlib only. The entry is exactly one sentence, 1-200 characters.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(here, "entry.txt"), "utf8");

// Gate (mirrors the competition gate): 1-200 chars, not only whitespace.
// The entry must also be exactly one sentence: a single terminal mark.
const trimmed = text.trim();
if (trimmed.length < 1 || trimmed.length > 200) {
  console.error(`entry must be 1-200 characters, got ${trimmed.length}`);
  process.exit(1);
}
const terminals = (trimmed.match(/[.!?]/g) ?? []).length;
if (terminals !== 1 || !/[.!?]$/.test(trimmed)) {
  console.error(`entry must be exactly one sentence, found ${terminals} sentence-ending marks`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
// Write the entry bytes exactly as they are in entry.txt: no added
// trailing newline, so the graded file is byte-identical to the source.
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
console.log(`wrote ${trimmed.length}-character, one-sentence entry to ${join(outDir, "entry.txt")}`);
