import { createToken, Lexer, TokenVocabulary } from "chevrotain";
import { generateVocabulary } from "@/common/vocabularyGenerator";

export const whiteSpace = createToken({
  name: "whiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

export const identifier = createToken({
  name: "identifier",
  pattern: Lexer.NA
});

export const months = createToken({
  name: "months",
  pattern: /JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC/,
  categories: [identifier]
});

export const days = createToken({
  name: "days",
  pattern: /SUN|MON|TUE|WED|THU|FRI|SAT/,
  categories: [identifier]
});

export const dash = createToken({ name: "dash", pattern: /-/ });

export const slash = createToken({ name: "slash", pattern: /\// });

export const comma = createToken({ name: "comma", pattern: /,/ });

export const integer = createToken({
  name: "integer",
  pattern: /[0-9]{1,2}/,
  categories: [identifier]
});

export const every = createToken({
  name: "every",
  pattern: /\*/,
  categories: [identifier]
});

// Base tokens
export const baseTokens = [whiteSpace, identifier, months, days, dash, slash, comma, integer, every];

export const baseVocabulary: TokenVocabulary = generateVocabulary(baseTokens);
