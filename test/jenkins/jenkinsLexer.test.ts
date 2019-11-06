import { Lexer } from "chevrotain";
import { baseTokens } from "@/common";
import { jenkinsTokens } from "@/jenkins";

const lexer = new Lexer(jenkinsTokens);

function testInput(input: string) {
  return lexer.tokenize(input);
}
describe("lexer test", () => {
  test("test round time token", () => {
    const res = testInput("H");
    expect(res.tokens.length).toBe(1);
  });
});
