import { createToken, TokenVocabulary } from "chevrotain";
import { cronTokens, identifier } from "./cron";
import { genVocabulary } from "./vocabularyGenerator";

// Jenkins specific
export const roundTime = createToken({
  name: "roundTime",
  pattern: /H/,
  categories: [identifier]
});
// Available tokens for Jenkins cron
export const jenkinsTokens = [...cronTokens, roundTime];

export const jenkinsVocabulary: TokenVocabulary = genVocabulary(jenkinsTokens);
