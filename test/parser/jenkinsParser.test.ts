import { EarlyExitException, Lexer, NotAllInputParsedException } from "chevrotain";
import { JenkinsTokens } from "../../src/lexer";
import { JenkinsParser } from "../../src/parser";

const parser = new JenkinsParser();
const lexer = new Lexer(JenkinsTokens);

function parse(input: string) {
  const lexingResult = lexer.tokenize(input);
  parser.input = lexingResult.tokens;
  return parser.cron();
}

describe("parser", () => {
  test("a simple valid expression", () => {
    // Given
    // Everyday at 04:05
    const expression = "5 4 * * *";
    // When
    parse(expression);
    // Then
    expect(parser.errors).toEqual([]);
  });

  test("Too many fields", () => {
    // Given
    // It takes a lot to make a stew
    const expression = "5 4 * * * *";
    // When
    parse(expression);
    // Then
    expect(parser.errors.length).toEqual(1);
    expect(parser.errors[0]).toBeInstanceOf(NotAllInputParsedException);
  });

  test("Too few fields", () => {
    // Given one field missing
    const expression = "5 4 * * ";
    // When
    parse(expression);
    // Then
    expect(parser.errors.length).toEqual(1);
    expect(parser.errors[0]).toBeInstanceOf(EarlyExitException);
  });

  test("with step value", () => {
    // Given
    // Every day of every other month at 04:05
    const expression = "5 4 * */2 *";
    // When
    parse(expression);
    // Then
    expect(parser.errors).toEqual([]);
  });

  test("with range", () => {
    // Given
    // At 04:00 on every day-of-month from 8 through 14
    const expression = "0 4 8-14 * *";
    // When
    parse(expression);
    // Then
    expect(parser.errors).toEqual([]);
  });

  test("Combined", () => {
    // Given
    // At minute 23 past every 2nd hour from 0 through 20
    const expression = "23 0-20/2 * * *";
    // When
    parse(expression);
    // Then
    expect(parser.errors).toEqual([]);
  });

  test("Jenkins hash value", () => {
    // Given
    // At minute 23 past every 2nd hour
    const expression = "23 H/2 * * *";
    // When
    parse(expression);
    // Then
    expect(parser.errors).toEqual([]);
  });
});
