import { Lexer } from "chevrotain";
import { quartzTokens } from "@/lexer";
import { QuartzParser } from "@/parser";
import { AbstractVisitor, QuartzVisitor } from "@/semantic/";
import { QuartzCronExpression } from "@/syntax/quartz";

describe("QuartzVisitor", () => {
  const parser = new QuartzParser();
  let lexer = new Lexer(quartzTokens);
  let visitor = new QuartzVisitor();

  const parse = (input: string) => {
    parser.input = lexer.tokenize(input).tokens;
    return parser.cronExpression();
  };

  test("a simple expression", () => {
    // Given
    // Everyday at 04:05
    const expression = "* 5 4 * * *";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("5");
    expect(ast.hour.value()).toEqual("4");
    expect(ast.dom.value()).toEqual("*");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("*");
  });

  test("with day of week", () => {
    // Given
    // Every 3rd Monday at 04:05
    const expression = "* 5 4 * * MON#3";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("5");
    expect(ast.hour.value()).toEqual("4");
    expect(ast.dom.value()).toEqual("*");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("MON#3");
  });

  test("with step value", () => {
    // Given
    // Every day of every other month at 04:05
    const expression = "* 5 4 * */2 *";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("5");
    expect(ast.hour.value()).toEqual("4");
    expect(ast.dom.value()).toEqual("*");
    expect(ast.month.value()).toEqual("*/2");
    expect(ast.dow.value()).toEqual("*");
  });

  test("with day of week numeric", () => {
    // Given
    // At 04:00 on every day-of-month from 8 through 14
    const expression = "* 0 4 8-14 * *";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("0");
    expect(ast.hour.value()).toEqual("4");
    expect(ast.dom.value()).toEqual("8-14");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("*");
  });

  test("with last day of week", () => {
    // Given
    // At 04:00 on every last thursday of the month
    const expression = "* 0 4 ? * THUL";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("0");
    expect(ast.hour.value()).toEqual("4");
    expect(ast.dom.value()).toEqual("?");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("THUL");
  });

  test("with last day of week", () => {
    // Given
    // At 04:00 on every third monday of the month
    const expression = "* 0 4 ? * MON#3";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("0");
    expect(ast.hour.value()).toEqual("4");
    expect(ast.dom.value()).toEqual("?");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("MON#3");
  });

  test("Combined", () => {
    // Given
    // At minute 23 past every 2nd hour from 0 through 20
    const expression = "* 23 0-20/2 * * *";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
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
    const expression = "* 0 12 1-10/2,15-25/3 * *";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
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
    // Expression should fail to parse since the range 10-1 is inverted
    const expression = "* 0 12 10-1/2,15-25/3 * *";

    // When
    const cst = parse(expression);
    expect(() => visitor.visit(cst)).toThrowError(/^Left\-hand/);
  });
});
