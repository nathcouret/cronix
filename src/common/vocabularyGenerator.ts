import { TokenType, TokenTypeDictionary } from "chevrotain";

/**
 * Convenience function to generate a vocabulary object from a list of token definitions.
 * @param tokens The token list to convert
 * @returns The corresponding vocabulary
 */
export function generateVocabulary(tokens: TokenType[]): TokenTypeDictionary {
  return tokens.reduce((map: TokenTypeDictionary, obj: TokenType) => {
    map[obj.name] = obj;
    return map;
  }, {});
}
