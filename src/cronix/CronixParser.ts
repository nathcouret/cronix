import { ILexingError, Lexer } from "chevrotain";
import { CronCstParser, CronCstParser as DefaultParser, CronVisitor } from "@/cron";
import { CronExpression } from "@/common/syntax";
import CronixMode from "./CronixMode";
import CronixExpression from "./CronixExpression";
import CronixOptions from "./CronixOptions";
import { JenkinsCstParser, jenkinsTokens, JenkinsVisitor } from "@/jenkins";
import { QuartzCronExpression, QuartzCstParser, quartzTokens, QuartzVisitor } from "@/quartz";
import { AbstractVisitor, BaseCstParser, baseTokens } from "@/common";
import { expressionToString } from "@/cronix/utils";

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
export interface ParserException extends Error {
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
export abstract class CronixParser<T extends CronExpression = CronExpression> {
  private readonly mode: CronixMode;
  private readonly _lexer: Lexer;
  private readonly _parser: DefaultParser;
  private readonly _visitor: AbstractVisitor;

  private _errors: ParserException[];

  protected constructor(options: CronixOptions = {
    mode: CronixMode.CRONTAB,
    tokens: baseTokens
  }, parser: BaseCstParser, visitor: AbstractVisitor) {
    this.mode = options.mode;
    this._lexer = new Lexer(options.tokens);
    this._parser = parser;
    this._visitor = visitor;
    this.parse = this.parse.bind(this);
    this.reset = this.reset.bind(this);
  }

  /**
   * Parse a complete Cron expression, according to the parser's context.
   * @param expression The expression to parse. Can either be a string or an object describing the expression
   * @return The parsed expression as a syntax tree
   */
  parse(expression: string | CronixExpression): T {
    // Reset the state of this instance
    this.reset();

    const stringExpr = expressionToString(expression, { mode: this.mode });
    const lexingResult = this._lexer.tokenize(stringExpr);
    lexingResult.errors.forEach(e => this._errors.push({
      name: "LexingError",
      message: e.message,
      innerException: e,
      step: ParserStep.LEXING
    }));
    this._parser.input = this._lexer.tokenize(stringExpr).tokens;
    const parsed = this._parser.cronExpression();
    // Check for parsing errors
    if (this._parser.errors.length > 0) {
      this._parser.errors.map(er => this._errors.push({
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
      this._errors.push({
        ...e,
        innerException: e,
        step: ParserStep.SEMANTIC
      });
      return null;
    }
  }

  parseField(expression: string): T {
    // Reset the state of this instance
    this.reset();

    const lexingResult = this._lexer.tokenize(expression);
    lexingResult.errors.forEach(e => this._errors.push({
      name: "LexingError",
      message: e.message,
      innerException: e,
      step: ParserStep.LEXING
    }));
    this._parser.input = this._lexer.tokenize(expression).tokens;
    const parsed = this._parser.expression();
    // Check for parsing errors
    if (this._parser.errors.length > 0) {
      this._parser.errors.map(er => this._errors.push({
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
      this._errors.push({
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
    this._errors = [];
  }

  get lexer(): Lexer {
    return this._lexer;
  }

  get parser(): CronCstParser {
    return this._parser;
  }

  get visitor(): AbstractVisitor {
    return this._visitor;
  }

  get errors(): ParserException[] {
    return this._errors;
  }
}

export class CronParser extends CronixParser {
  constructor() {
    super({
      mode: CronixMode.CRONTAB,
      tokens: baseTokens
    }, new CronCstParser(), new CronVisitor());
  }

}

export class QuartzParser extends CronixParser<QuartzCronExpression> {
  constructor() {
    super({
      mode: CronixMode.QUARTZ,
      tokens: quartzTokens
    }, new QuartzCstParser(), new QuartzVisitor());
  }
}

export class JenkinsParser extends CronixParser {
  constructor() {
    super({
      mode: CronixMode.JENKINS,
      tokens: jenkinsTokens
    }, new JenkinsCstParser(), new JenkinsVisitor());
  }
}
