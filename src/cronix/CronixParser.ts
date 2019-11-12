import { CstNode, ILexingError, Lexer } from "chevrotain";
import { CronParser as DefaultParser, CronVisitor } from "@/cron";
import { CronExpression, Expression } from "@/common/syntax";
import CronixMode from "./CronixMode";
import CronixExpression from "./CronixExpression";
import CronixOptions from "./CronixOptions";
import { JenkinsParser, jenkinsTokens, JenkinsVisitor } from "@/jenkins";
import { QuartzParser, quartzTokens, QuartzVisitor } from "@/quartz";
import { baseTokens, AbstractVisitor } from "@/common";

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
      const expr = [expression.second || "0"].concat(base);
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
 * Enum indicating the different steps the parser goes through. Useful for error reporting
 */
export enum ParserStep {
  LEXING = "lexing",
  PARSING = "parsing",
  SEMANTIC = "semantic"
}

/**
 * An exception raised during parsing to indicate failure to process the input.
 */
export interface CronixParserException extends Error {
  /**
   * The root cause of the exception
   */
  innerException: Error | ILexingError;
  /**
   * Indicates the step at which the parser failed
   */
  step: ParserStep;
}

/**
 * A Cron parser with support for multiple cron dialects.
 */
export default class CronixParser {
  private readonly mode: CronixMode;
  private readonly _lexer: Lexer;
  private readonly _parser: DefaultParser;
  private readonly _visitor: AbstractVisitor;

  private _parserErrors: CronixParserException[];

  constructor(options: CronixOptions = { mode: CronixMode.CRONTAB }) {
    this.mode = options.mode;
    switch (options.mode) {
      case CronixMode.JENKINS:
        this._lexer = new Lexer(jenkinsTokens);
        this._parser = new JenkinsParser();
        this._visitor = new JenkinsVisitor();
        break;
      case CronixMode.QUARTZ:
        this._lexer = new Lexer(quartzTokens);
        this._parser = new QuartzParser();
        this._visitor = new QuartzVisitor();
        break;
      case CronixMode.CRONTAB:
      default:
        this._lexer = new Lexer(baseTokens);
        this._parser = new DefaultParser();
        this._visitor = new CronVisitor();
    }
    this.parse = this.parse.bind(this);
    this.parseField = this.parseField.bind(this);
    this.reset = this.reset.bind(this);
  }

  /**
   * Parse a complete Cron expression, according to the parser's context.
   * @param expression The expression to parse. Can either be a string or an object describing the expression
   * @return The parsed expression as a syntax tree
   */
  parse<T extends CronExpression>(expression: string | CronixExpression): T {
    const stringExpr = convertToString(expression, { mode: this.mode });
    return this.doParse(stringExpr, "cronExpression");
  }

  /**
   * Parse an expression element, according to the parser's context.
   * @param expression The expression to parse.
   * @return The parsed expression as a syntax tree
   */
  parseField<T extends Expression>(expression: string): T {
    return this.doParse(expression, "expression");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private doParse<T>(input: string, handler: string): T {
    // Reset the state of this instance
    this.reset();
    const lexingResult = this._lexer.tokenize(input);
    lexingResult.errors.forEach(e => this._parserErrors.push({
      name: "LexingError",
      message: e.message,
      innerException: e,
      step: ParserStep.LEXING
    }));
    this._parser.input = this._lexer.tokenize(input).tokens;
    const parsed = this._parser[handler]();
    // Check for parsing errors
    if (this._parser.errors.length > 0) {
      this._parser.errors.map(er => this._parserErrors.push({
        ...er,
        innerException: er,
        step: ParserStep.PARSING
      }));
      return null;
    }
    try {
      return this._visitor.visit(parsed);
    } catch (e) {
      // Handle semantic errors
      this._parserErrors.push({
        ...e,
        innerException: e,
        step: ParserStep.SEMANTIC
      });
      return null;
    }
  }

  /**
   * Reset the parser's state. This flush any errors raised during a previous parse.
   */
  private reset() {
    this._parserErrors = [];
  }

  get lexer() {
    return this._parser;
  }

  get parser() {
    return this._parser;
  }

  get visitor() {
    return this._visitor;
  }

  get errors() {
    return this._parserErrors;
  }
}
