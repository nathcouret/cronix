import { createToken, Lexer, TokenType, TokenTypeDictionary, TokenVocabulary } from "chevrotain";

export const Months = createToken({ name: "Months", pattern: /JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC/ });

export const Days = createToken({ name: "Days", pattern: /SUN|MON|TUE|WED|THU|FRI|SAT/ });

export const Dash = createToken({ name: "Dash", pattern: /-/ });

export const Slash = createToken({ name: "Slash", pattern: /\// });

export const Comma = createToken({ name: "Comma", pattern: /,/ });

export const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ });

export const Every = createToken({ name: "Every", pattern: /\*/ });

// Quartz specific
export const Any = createToken({ name: "Any", pattern: /\?/ });

export const Sharp = createToken({ name: "Sharp", pattern: /#/ });

export const Last = createToken({ name: "Last", pattern: /L/ });

export const Weekday = createToken({ name: "Weekday", pattern: /W/ });

// Jenkins specific
export const RoundTime = createToken({ name: "RoundTime", pattern: /H/ });

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

export const baseTokens = [WhiteSpace, Months, Days, Dash, Slash, Comma, Integer, Every];

// Available tokens for Quartz cron
export const quartzTokens = [...baseTokens, Any, Sharp, Last, Weekday];

// Available tokens for Jenkins cron
export const JenkinsTokens = [...baseTokens, RoundTime];

function genVocabulary(tokens: TokenType[]) {
  return tokens.reduce((map: TokenTypeDictionary, obj: TokenType) => {
    map[obj.name] = obj;
    return map;
  }, {});
}

export const baseVocabulary: TokenVocabulary = genVocabulary(baseTokens);

export const quartzVocabulary: TokenVocabulary = genVocabulary(quartzTokens);

export const jenkinsVocabulary: TokenVocabulary = genVocabulary(JenkinsTokens);

export const CronLexer = new Lexer(quartzTokens);
