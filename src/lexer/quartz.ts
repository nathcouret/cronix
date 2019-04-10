import { createToken, TokenVocabulary } from "chevrotain";
import { cronTokens, identifier } from "./cron";
import { genVocabulary } from "./vocabularyGenerator";

// Quartz specific
export const anyToken = createToken({
  name: "anyToken",
  pattern: /\?/,
  categories: [identifier]
});

export const sharp = createToken({ name: "sharp", pattern: /#/ });

export const last = createToken({
  name: "last",
  pattern: /L/,
  categories: [identifier]
});

export const weekday = createToken({
  name: "weekday",
  pattern: /W/,
  categories: [identifier]
});

// Available tokens for Quartz cron
export const quartzTokens = [...cronTokens, anyToken, sharp, last, weekday];

export const quartzVocabulary: TokenVocabulary = genVocabulary(quartzTokens);
