// One Sentence for a Traveler from 1800 — writes the entry sentence to /output/entry.txt.
// Node 22, stdlib only. The entry is exactly one sentence, 1-200 characters.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(here, "entry.txt"), "utf8");

// Gate (mirrors the competition gate): 1-200 chars, not only whitespace.
// The entry must also be exactly one sentence: a single terminal mark.
// Centralised here so the check lives in one place and every caller
// (and every future gate change) goes through the same validation.
function validateEntry(source) {
  const trimmed = source.trim();
  if (trimmed.length < 1 || trimmed.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${trimmed.length}`);
  }
  const terminals = (trimmed.match(/[.!?]/g) ?? []).length;
  if (terminals !== 1 || !/[.!?]$/.test(trimmed)) {
    throw new Error(
      `entry must be exactly one sentence, found ${terminals} sentence-ending marks`,
    );
  }
  return trimmed;
}

let trimmed;
try {
  trimmed = validateEntry(text);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
// Write the entry bytes exactly as they are in entry.txt: no added
// trailing newline, so the graded file is byte-identical to the source.
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, text, "utf8");
// Guard against a partial or transformed write: the graded file must be
// byte-identical to entry.txt, so read it back and compare before
// reporting success.
if (readFileSync(outPath, "utf8") !== text) {
  console.error("written entry.txt is not byte-identical to entry.txt");
  process.exit(1);
}
console.log(`wrote ${trimmed.length}-character, one-sentence entry to ${outPath}`);
