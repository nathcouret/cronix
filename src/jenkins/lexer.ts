import { createToken, TokenVocabulary } from "chevrotain";
import { identifier } from "@/common/lexer";
import { baseTokens, generateVocabulary } from "@/common";

// Jenkins specific
export const roundTime = createToken({
  name: "roundTime",
  pattern: /H/,
  categories: [identifier]
});
// Available tokens for Jenkins cron
export const jenkinsTokens = [...baseTokens, roundTime];

export const jenkinsVocabulary: TokenVocabulary = generateVocabulary(jenkinsTokens);
