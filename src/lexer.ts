import { createToken, Lexer, TokenType, TokenTypeDictionary, TokenVocabulary } from "chevrotain";

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

// Jenkins specific
export const roundTime = createToken({
  name: "roundTime",
  pattern: /H/,
  categories: [identifier]
});

// Base tokens
export const baseTokens = [whiteSpace, identifier, months, days, dash, slash, comma, integer, every];

// Available tokens for Quartz cron
export const quartzTokens = [...baseTokens, anyToken, sharp, last, weekday];

// Available tokens for Jenkins cron
export const jenkinsTokens = [...baseTokens, roundTime];

function genVocabulary(tokens: TokenType[]) {
  return tokens.reduce((map: TokenTypeDictionary, obj: TokenType) => {
    map[obj.name] = obj;
    return map;
  }, {});
}

export const baseVocabulary: TokenVocabulary = genVocabulary(baseTokens);

export const quartzVocabulary: TokenVocabulary = genVocabulary(quartzTokens);

export const jenkinsVocabulary: TokenVocabulary = genVocabulary(jenkinsTokens);

export const cronLexer = new Lexer(baseTokens);
