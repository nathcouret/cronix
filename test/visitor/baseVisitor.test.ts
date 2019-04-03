import { Lexer } from "chevrotain";
import { baseTokens, baseVocabulary } from "../../src/lexer";
import { BaseParser } from "../../src/parser";
import { BaseVisitor } from "../../src/semantic/BaseVisitor";
import { CronExpression } from "../../src/syntax/base";

const parser = new BaseParser(baseVocabulary);
const lexer = new Lexer(baseTokens);

function parse(input: string) {
  const lexingResult = lexer.tokenize(input);
  parser.input = lexingResult.tokens;
  return parser.cron();
}

describe("BaseVisitor", () => {
  test("a simple expression", () => {
    // Given
    // Everyday at 04:05
    const expression = "5 4 * * *";
    // When
    const cst = parse(expression);
    const ast: CronExpression = new BaseVisitor().visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("5");
    expect(ast.hour.value()).toEqual("4");
    expect(ast.dom.value()).toEqual("*");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("*");
  });

  test("with step value", () => {
    // Given
    // Every day of every other month at 04:05
    const expression = "5 4 * */2 *";
    // When
    const cst = parse(expression);
    const ast: CronExpression = new BaseVisitor().visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("5");
    expect(ast.hour.value()).toEqual("4");
    expect(ast.dom.value()).toEqual("*");
    expect(ast.month.value()).toEqual("*/2");
    expect(ast.dow.value()).toEqual("*");
  });

  test("with range", () => {
    // Given
    // At 04:00 on every day-of-month from 8 through 14
    const expression = "0 4 8-14 * *";
    // When
    const cst = parse(expression);
    const ast: CronExpression = new BaseVisitor().visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("0");
    expect(ast.hour.value()).toEqual("4");
    expect(ast.dom.value()).toEqual("8-14");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("*");
  });

  test("Combined", () => {
    // Given
    // At minute 23 past every 2nd hour from 0 through 20
    const expression = "23 0-20/2 * * *";
    // When
    const cst = parse(expression);
    const ast: CronExpression = new BaseVisitor().visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("23");
    expect(ast.hour.value()).toEqual("0-20/2");
    expect(ast.dom.value()).toEqual("*");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("*");
  });
  test("Very complex expression", () => {
    // Given
    // At 12:00 on every 2nd day-of-month from 1 through 10 and every 3rd day-of-month from 15 through 25
    const expression = "0 12 1-10/2,15-25/3 * *";
    // When
    const cst = parse(expression);
    const ast: CronExpression = new BaseVisitor().visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("0");
    expect(ast.hour.value()).toEqual("12");
    expect(ast.dom.value()).toEqual("1-10/2,15-25/3");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("*");
  });
  // TODO Fix visitor to raise
  test("Very complex expression with error", () => {
    // Given
    // At 12:00 on every 2nd day-of-month from 10 through 1 and every 3rd day-of-month from 15 through 25
    const expression = "0 12 10-1/2,15-25/3 * *";

    // When
    const cst = parse(expression);
    const ast: CronExpression = new BaseVisitor().visit(cst);
    /// Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("0");
    expect(ast.hour.value()).toEqual("12");
    expect(ast.dom.value()).toEqual("10-1/2,15-25/3");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("*");
  });
});
