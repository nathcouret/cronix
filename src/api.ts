import { ILexingResult, Lexer } from "chevrotain";
import { cronTokens, cronVocabulary, jenkinsTokens, quartzTokens } from "./lexer";
import { BaseParser, JenkinsParser, QuartzParser } from "./parser";
import { BaseVisitor, JenkinsVisitor, QuartzVisitor } from "./semantic";
import { CronExpression } from "./syntax/base";
import { QuartzCronExpression } from "./syntax/quartz";

// default values to * to reduce boilerplate for the user
// second and year optionals, only used by Quartz parser
export interface CronExpr {
  second?: string;
  minute?: string;
  hour?: string;
  dayOfMonth?: string;
  month?: string;
  dayOfWeek?: string;
  year?: string;
}

export enum CronMode {
  CRONTAB = "Crontab",
  QUARTZ = "Quartz",
  JENKINS = "Jenkins"
}

interface CronOptions {
  mode: CronMode;
  loose?: boolean;
}

function isCronException(expression: string | CronExpr): expression is CronExpr {
  return (expression as CronExpr).hour !== undefined;
}

function computeExpr(expr: string, options: CronOptions): CronExpression | QuartzCronExpression {
  const { mode } = options;
  let parser: BaseParser;
  let lexingResult: ILexingResult;
  switch (mode) {
    case CronMode.QUARTZ:
      const quartzLexer = new Lexer(quartzTokens);
      lexingResult = quartzLexer.tokenize(expr);
      parser = new QuartzParser();
      parser.input = lexingResult.tokens;
      return new QuartzVisitor().visit(parser.cron()) as QuartzCronExpression;
    case CronMode.JENKINS:
      lexingResult = new Lexer(jenkinsTokens).tokenize(expr);
      parser = new JenkinsParser();
      parser.input = lexingResult.tokens;
      return new JenkinsVisitor().visit(parser.cron()) as CronExpression;
    case CronMode.CRONTAB:
    default:
      const cronLexer = new Lexer(cronTokens);
      lexingResult = cronLexer.tokenize(expr);
      parser = new BaseParser(cronVocabulary);
      parser.input = lexingResult.tokens;
      return new BaseVisitor().visit(parser.cron()) as CronExpression;
  }
}

function compute(expression: CronExpr, options: CronOptions): string {
  const { mode } = options;
  // default values to * to reduce boilerplate for the user
  const base = [
    expression.minute || "*",
    expression.hour || "*",
    expression.dayOfMonth || "*",
    expression.month || "*",
    expression.dayOfWeek || "*"
  ];
  switch (mode) {
    case CronMode.QUARTZ:
      let expr = base;
      if (expression.second) {
        expr = [expression.second].concat(base);
      }
      if (expression.year) {
        expr.push(expression.year);
      }
      return expr.join(" ");
    case CronMode.JENKINS:
    case CronMode.CRONTAB:
    default:
      return base.join(" ");
  }
}

export function cron(expression: string | CronExpr, options: CronOptions = { mode: CronMode.CRONTAB, loose: false }) {
  const expr = isCronException(expression) ? compute(expression, options) : expression;
  return computeExpr(expr, options);
}
