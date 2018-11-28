import { createToken, Lexer, TokenType, TokenTypeDictionary, TokenVocabulary } from "chevrotain";

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

export const Identifier = createToken({name: "Identifier", pattern: Lexer.NA});

export const Months = createToken({ name: "Months", pattern: /JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC/, categories: [Identifier] });

export const Days = createToken({ name: "Days", pattern: /SUN|MON|TUE|WED|THU|FRI|SAT/, categories: [Identifier] });

export const Dash = createToken({ name: "Dash", pattern: /-/ });

export const Slash = createToken({ name: "Slash", pattern: /\// });

export const Comma = createToken({ name: "Comma", pattern: /,/ });

export const Integer = createToken({ name: "Integer", pattern: /[0-9]{1,2}/, categories: [Identifier] });

export const Every = createToken({ name: "Every", pattern: /\*/, categories: [Identifier] });

// Quartz specific
export const Any = createToken({ name: "Any", pattern: /\?/, categories: [Identifier] });

export const Sharp = createToken({ name: "Sharp", pattern: /#/ });

export const Last = createToken({ name: "Last", pattern: /L/, categories: [Identifier] });

export const Weekday = createToken({ name: "Weekday", pattern: /W/, categories: [Identifier] });

// Jenkins specific
export const RoundTime = createToken({ name: "RoundTime", pattern: /H/, categories: [Identifier] });

// Base tokens
export const baseTokens = [WhiteSpace, Identifier, Months, Days, Dash, Slash, Comma, Integer, Every];

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

export const CronLexer = new Lexer(baseTokens);
