import { Lexer } from "chevrotain";
import { baseTokens } from "@/common";

const cronLexer = new Lexer(baseTokens);

function testInput(input: string) {
  return cronLexer.tokenize(input);
}
describe("lexer test", () => {
  test("test single day", () => {
    const res = testInput("MON");
    expect(res.tokens.length).toBe(1);
  });

  test("test single integer", () => {
    const res = testInput("0");
    expect(res.tokens.length).toBe(1);
  });

  test("test range", () => {
    const res = testInput("3-5");
    expect(res.tokens.length).toBe(3);
  });

  test("test interval", () => {
    const res = testInput("12/3");
    expect(res.tokens.length).toBe(3);
  });

  test("test union", () => {
    const res = testInput("10,3,JAN");
    expect(res.tokens.length).toBe(5);
  });

  test("test every", () => {
    const res = testInput("*");
    expect(res.tokens.length).toBe(1);
  });

  test("mixed union", () => {
    const res = testInput("MON,WED-FRI,SAT");
    expect(res.tokens.length).toBe(7);
  });
});
