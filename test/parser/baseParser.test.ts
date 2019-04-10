import { EarlyExitException, Lexer, NotAllInputParsedException } from "chevrotain";
import { cronTokens, cronVocabulary } from "../../src/lexer";
import { BaseParser } from "../../src/parser";

const parser = new BaseParser(cronVocabulary);
const lexer = new Lexer(cronTokens);

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

  test("Very complex expression", () => {
    // At 12:00 on every 2nd day-of-month from 1 through 10 and every 3rd day-of-month from 15 through 25
    const expression = "0 12 1-10/2,15-25/3 * *";

    parse(expression);

    expect(parser.errors).toEqual([]);
  });

  test("Very complex expression with error", () => {
    // At 12:00 on every 2nd day-of-month from 10 through 1 and every 3rd day-of-month from 15 through 25
    const expression = "0 12 10-1/2,15-25/3 * *";

    parse(expression);
    // It's actually a semantic error
    expect(parser.errors).toEqual([]);
  });

  test("Extraneous dash in range expression", () => {
    const expression = "0 12 15--25/3 * *";

    parse(expression);

    expect(parser.errors.length).toBe(1);
  });

  test("missing operand in step value", () => {
    const expression = "0 12 5/ * *";

    parse(expression);

    expect(parser.errors.length).toBe(1);
  });

  test("empty subexpression", () => {
    const expression = "0 5/2 * *";

    parse(expression);

    expect(parser.errors.length).toBe(1);
  });
});
