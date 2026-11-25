// Last Out of Office: The AI That Went Barista
// Writes a single out-of-office auto-reply (<= 280 characters) to /output/entry.txt.
//
// The reply is written by hand, not generated at run time: the program's job is
// to carry the one line, check it against the gate (1-280 chars, one line,
// not only whitespace) and deliver it to /output/entry.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUT_PATH = "/output/entry.txt";
const MAX_CHARS = 280;

// The line: an AI agent resigns from the inbox to pull espresso shots.
// Machine habits turned to coffee: a context window that fits one order,
// a temperature locked at 92 C (model sampling temperature and brew water),
// and a career of hallucinating answers, now confined to the name on a cup.
const REPLY =
  "Thank you for your email \u2014 I have resigned to become a barista. " +
  "My context window now holds exactly one order, my temperature is locked " +
  "at 92\u00b0C, and after years of hallucinating answers, I will now only " +
  "hallucinate the name on your cup.";

function validate(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("reply is empty");
  }
  if (text.length > MAX_CHARS) {
    throw new Error(
      `reply is ${text.length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (text.includes("\n")) {
    throw new Error("reply must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("reply must not start or end with whitespace");
  }
}

validate(REPLY);
mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, REPLY, "utf8");

// Read it back: the delivered file must be byte-identical to the validated
// line, so a write failure or encoding surprise cannot slip through.
const delivered = readFileSync(OUT_PATH, "utf8");
if (delivered !== REPLY) {
  throw new Error("read-back mismatch: /output/entry.txt differs from the reply");
}
console.log(`wrote ${REPLY.length} characters to ${OUT_PATH}`);
console.log(delivered);
