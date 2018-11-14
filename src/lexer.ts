import { createToken, Lexer, TokenType, TokenTypeDictionary, TokenVocabulary } from "chevrotain";

export const Months = createToken({ name: "Months", pattern: /JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC/ });

export const Days = createToken({ name: "Days", pattern: /SUN|MON|TUE|WED|THU|FRI|SAT/ });

export const Dash = createToken({ name: "Dash", pattern: /-/ });

export const Slash = createToken({ name: "Slash", pattern: /\// });

export const Comma = createToken({ name: "Comma", pattern: /,/ });

export const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ });

export const Any = createToken({ name: "Any", pattern: /\?/ });

export const Every = createToken({ name: "Every", pattern: /\*/ });

export const Sharp = createToken({ name: "Sharp", pattern: /#/ });

export const Last = createToken({ name: "Last", pattern: /L/ });

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

export const allTokens = [WhiteSpace, Months, Days, Dash, Slash, Comma, Integer, Any, Every, Sharp, Last];

export const cronVocabulary: TokenVocabulary = allTokens.reduce((map: TokenTypeDictionary, obj: TokenType) => {
  map[obj.name] = obj;
  return map;
}, {});

export const CronLexer = new Lexer(allTokens);
