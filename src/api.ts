import { baseVocabulary, cronLexer } from "./lexer";
import { BaseParser } from "./parser";
import { BaseVisitor } from "./semantic/BaseVisitor";
import { CronExpression } from "./syntax/base";

// default values to * to reduce boilerplate for the user
// second and year optionals, only used for Quartz scheduler
export interface ICronExpr {
  second?: string;
  minute?: string;
  hour?: string;
  dayOfMonth?: string;
  month?: string;
  dayOfWeek?: string;
  year?: string;
}

enum CronMode {
  CRONTAB,
  QUARTZ,
  JENKINS
}

interface ICronOptions {
  mode: CronMode;
}

export function cron(expression: string | ICronExpr, options: ICronOptions = { mode: CronMode.CRONTAB }) {
  const expr = isCronException(expression) ? compute(expression, options) : expression;
  return computeExpr(expr, options);
}

function isCronException(expression: string | ICronExpr): expression is ICronExpr {
  return (expression as ICronExpr).hour !== undefined;
}

function computeExpr(expr: string, options: ICronOptions): CronExpression {
  const { mode } = options;
  switch (mode) {
    case CronMode.QUARTZ:
    case CronMode.JENKINS:
    case CronMode.CRONTAB:
    default:
      const lexingResult = cronLexer.tokenize(expr);
      const parser = new BaseParser(baseVocabulary);
      parser.input = lexingResult.tokens;
      const cst = parser.cron();
      return new BaseVisitor().visit(cst);
  }
}

function compute(expression: ICronExpr, options: ICronOptions): string {
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
