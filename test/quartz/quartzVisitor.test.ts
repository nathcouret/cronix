import { EarlyExitException, Lexer, MismatchedTokenException } from "chevrotain";
import { quartzTokens, QuartzCstParser, QuartzVisitor } from "@/quartz";
import { QuartzCronExpression } from "@/quartz/syntax";

describe("QuartzVisitor", () => {
  const parser = new QuartzCstParser();
  const lexer = new Lexer(quartzTokens);
  const visitor = new QuartzVisitor();

  const parse = (input: string) => {
    parser.input = lexer.tokenize(input).tokens;
    return parser.cronExpression();
  };

  test("a simple expression", () => {
    // Given
    // Everyday at 04:05
    const expression = "* 5 4 * * ?";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
    // Then
    expect(parser.errors.length).toBe(0);
    expect(ast.minute.value()).toEqual("5");
    expect(ast.hour.value()).toEqual("4");
    expect(ast.dom.value()).toEqual("*");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("?");
  });

  test("with step value ok", () => {
    // Given
    // Every day of every other month at 04:05
    const expression = "* 5 4 * */2 ?";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("5");
    expect(ast.hour.value()).toEqual("4");
    expect(ast.dom.value()).toEqual("*");
    expect(ast.month.value()).toEqual("*/2");
    expect(ast.dow.value()).toEqual("?");
  });

  test("with range ok", () => {
    // Given
    // At 04:00 on every day-of-month from 8 through 14
    const expression = "* 0 4 8-14 * ?";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("0");
    expect(ast.hour.value()).toEqual("4");
    expect(ast.dom.value()).toEqual("8-14");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("?");
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

  test("Day of week within bound", () => {
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
    const expression = "* 23 0-20/2 * * ?";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("23");
    expect(ast.hour.value()).toEqual("0-20/2");
    expect(ast.dom.value()).toEqual("*");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("?");
  });

  test("Very complex expression", () => {
    // Given
    // At 12:00 on every 2nd day-of-month from 1 through 10 and every 3rd day-of-month from 15 through 25
    const expression = "* 0 12 1-10/2,15-25/3 * ?";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
    // Then
    expect(parser.errors).toEqual([]);
    expect(ast.minute.value()).toEqual("0");
    expect(ast.hour.value()).toEqual("12");
    expect(ast.dom.value()).toEqual("1-10/2,15-25/3");
    expect(ast.month.value()).toEqual("*");
    expect(ast.dow.value()).toEqual("?");
  });

  test("Range values in inverted order", () => {
    // Given
    // At 12:00 on every 2nd day-of-month from 10 through 1 and every 3rd day-of-month from 15 through 25
    // Expression should fail to parse since the range 10-1 is inverted
    const expression = "* 0 12 10-1/2,15-25/3 * ?";

    // When
    const cst = parse(expression);
    expect(() => visitor.visit(cst)).toThrowError(/^Left\-hand/);
  });

  test("Day of week should fail when occurence is above 5", () => {
    // Given
    // At 12:00 on every 2nd day-of-month from 10 through 1 and every 3rd day-of-month from 15 through 25
    // Expression should fail to parse since the range 10-1 is inverted
    const expression = "* 0 12 ? * MON#7";

    // When
    const cst = parse(expression);
    expect(() => visitor.visit(cst)).toThrowError(/^Occurrence/);
  });

  test("Day of week should fail when occurrence is negative", () => {
    // Given
    // At 12:00 on every 2nd day-of-month from 10 through 1 and every 3rd day-of-month from 15 through 25
    // Expression should fail to parse since the range 10-1 is inverted
    const expression = "* 0 12 ? * MON#-7";

    // When
    const cst = parse(expression);
    const ast = visitor.visit(cst);
    expect(parser.errors.length).toBe(1);
    expect(parser.errors[0]).toBeInstanceOf(MismatchedTokenException);
    expect(ast).toBeUndefined();
  });

  test("a simple expression", () => {
    // Given
    // Everyday at 04:05
    const expression = "* 5 4 * *";
    // When
    const cst = parse(expression);
    const ast: QuartzCronExpression = visitor.visit(cst);
    // Then
    expect(parser.errors.length).toBe(1);
    expect(parser.errors[0]).toBeInstanceOf(EarlyExitException);
    expect(ast).toBeUndefined();
  });
});
