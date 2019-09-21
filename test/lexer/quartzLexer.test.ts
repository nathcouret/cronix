import { Lexer } from "chevrotain";
import { quartzTokens } from "../../src/lexer";

const quartzLexer = new Lexer(quartzTokens);

function testInput(input: string) {
  return quartzLexer.tokenize(input);
}

describe("Quartz lexer test", () => {
  test("day of week", () => {
    const res = testInput("MON#3");
    expect(res.errors.length).toBe(0);
    expect(res.tokens.length).toBe(3);
  });

  test("last day of week", () => {
    const res = testInput("TUEL");
    expect(res.errors.length).toBe(0);
    expect(res.tokens.length).toBe(2);
  });
});
