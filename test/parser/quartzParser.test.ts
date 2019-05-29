import { Lexer } from "chevrotain";
import { quartzTokens } from "../../src/lexer";
import { QuartzParser } from "../../src/parser";

const lexer = new Lexer(quartzTokens);
const parser = new QuartzParser();

function parse(input: string) {
  const lexingResult = lexer.tokenize(input);
  parser.input = lexingResult.tokens;
  return parser.cron();
}

describe("parser", () => {
  test("a simple valid expression", () => {
    // Given
    // Everyday at 04:05
    const expression = "0 5 4 * * ?";
    // When
    parse(expression);
    // Then
    expect(parser.errors).toEqual([]);
  });

  test("a simple valid expression with year", () => {
    // Given
    // Everyday at 04:05
    const expression = "0 5 4 * * ? *";
    // When
    parse(expression);
    // Then
    expect(parser.errors).toEqual([]);
  });

  test("a day of week expression", () => {
    // Given
    // Everyday at 04:05
    const expression = "0 5 4 * 1-8/2 MON#5 *";
    // When
    parse(expression);
    // Then
    expect(parser.errors).toEqual([]);
  });

  test("a day of week last expression", () => {
    // Given
    // Everyday at 04:05
    const expression = "0 5 4 * 1-8/2 MONL *";
    // When
    parse(expression);
    // Then
    expect(parser.errors).toEqual([]);
  });

  test("a combined expression", () => {
    // Given
    // Everyday at 04:05
    const expression = "0 5 4 * 1-8/2 MON-FRI *";
    // When
    parse(expression);
    // Then
    expect(parser.errors).toEqual([]);
  });

  test("Very complex expression", () => {
    // At 12:00 on every 2nd day-of-month from 1 through 10 and every 3rd day-of-month from 15 through 25
    const expression = "0 0 12 1-10/2,15-25/3 * ? *";

    parse(expression);

    expect(parser.errors).toEqual([]);
  });

  test("Very complex expression with semantic error", () => {
    // At 12:00 on every 2nd day-of-month from 1 through 10 and every 3rd day-of-month from 15 through 25
    const expression = "0 0 12 1-10/2,15-25/3 * ? *";

    parse(expression);
    // It's actually a semantic error
    expect(parser.errors).toEqual([]);
  });
});
