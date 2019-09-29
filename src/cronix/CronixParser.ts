import { CronixExpression, CronixMode, CronixOptions } from "./api";
import { Lexer } from "chevrotain";
import { CronParser as DefaultParser, JenkinsParser, QuartzParser } from "@/parser";
import { AbstractVisitor, CronVisitor, JenkinsVisitor, QuartzVisitor } from "@/semantic";
import { cronTokens, cronVocabulary, jenkinsTokens, quartzTokens } from "@/lexer";
import { CronExpression, Expression } from "@/syntax";

/**
 * Convert an expression to its string representation. If the provided expression is already a string it is simply returned.
 * The conversion strategy depends on the options passed (for instance, Quartz has additional fields which require a different processing).
 * @param expression The expression to convert
 * @param options The context to infer the conversion strategy from
 */
export function convertToString(expression: CronixExpression | string, { mode }: CronixOptions): string {
  if (typeof expression === "string") {
    return expression;
  }
  // default values to * to reduce boilerplate for the user
  const base = [
    expression.minute || "*",
    expression.hour || "*",
    expression.dayOfMonth || "*",
    expression.month || "*",
    expression.dayOfWeek || "*"
  ];
  switch (mode) {
    case CronixMode.QUARTZ:
      let expr = [expression.second || "0"].concat(base);
      if (expression.year) {
        expr.push(expression.year);
      }
      return expr.join(" ");
    case CronixMode.JENKINS:
    case CronixMode.CRONTAB:
    default:
      return base.join(" ");
  }
}

/**
 * A Cron parser with support for multiple cron dialects.
 */
export default class CronixParser {
  private readonly mode: CronixMode;
  private readonly lexer: Lexer;
  private readonly parser: DefaultParser;
  private readonly visitor: AbstractVisitor;

  constructor(options: CronixOptions = { mode: CronixMode.CRONTAB }) {
    this.mode = options.mode;
    switch (options.mode) {
      case CronixMode.JENKINS:
        this.lexer = new Lexer(jenkinsTokens);
        this.parser = new JenkinsParser();
        this.visitor = new JenkinsVisitor();
        break;
      case CronixMode.QUARTZ:
        this.lexer = new Lexer(quartzTokens);
        this.parser = new QuartzParser();
        this.visitor = new QuartzVisitor();
        break;
      case CronixMode.CRONTAB:
      default:
        this.lexer = new Lexer(cronTokens);
        this.parser = new DefaultParser(cronVocabulary);
        this.visitor = new CronVisitor();
    }
    this.parse = this.parse.bind(this);
    this.parseElement = this.parseElement.bind(this);
  }

  /**
   * Parse a complete Cron expression, according to the parser's context.
   * @param expression The expression to parse. Can either be a string or an object describing the expression
   * @return The parsed expression as a syntax tree
   */
  parse<T extends CronExpression>(expression: string | CronixExpression): T {
    const stringExpr = convertToString(expression, { mode: this.mode });
    this.parser.input = this.lexer.tokenize(stringExpr).tokens;
    const parsed = this.parser.cron();
    return this.visitor.visit(parsed);
  }

  /**
   * Parse an expression element, according to the parser's context.
   * @param expression The expression to parse. Can either be a string or an object describing the expression
   * @return The parsed expression as a syntax tree
   */
  parseElement<T extends Expression>(expression: string): T {
    const stringExpr = convertToString(expression, { mode: this.mode });
    this.parser.input = this.lexer.tokenize(stringExpr).tokens;
    const parsed = this.parser.expression();
    return this.visitor.visit(parsed);
  }
}
