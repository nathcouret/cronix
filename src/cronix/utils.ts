import CronixExpression, { CronixField } from "@/cronix/CronixExpression";
import CronixOptions from "@/cronix/CronixOptions";
import CronixMode from "@/cronix/CronixMode";

/**
 * Convert an expression to its string representation. If the provided expression is already a string it is simply returned.
 * The conversion strategy depends on the options passed (for instance, Quartz has additional fields which require a different processing).
 * @param expression The expression to convert
 * @param options The context to infer the conversion strategy from
 */
export function expressionToString(expression: CronixExpression | string, { mode }: Pick<CronixOptions, "mode">): string {
  if (typeof expression === "string") {
    return expression;
  }
  // default values to * to reduce boilerplate for the user
  const base = [
    fieldToString(expression.minute),
    fieldToString(expression.hour),
    fieldToString(expression.dayOfMonth),
    fieldToString(expression.month),
    fieldToString(expression.dayOfWeek)
  ];
  switch (mode) {
    case CronixMode.QUARTZ:
      const second = expression.second === undefined || expression.second === null ? "*" : expression.second;
      const expr = [second].concat(base);
      if (expression.year !== undefined && expression.year !== null) {
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
 *
 * @param field
 */
export function fieldToString(field: CronixField): string {
  if (typeof field === "string") {
    return field;
  }
  if (typeof field === "number") {
    return String(field).valueOf();
  }
  if (Array.isArray(field)) {
    return (field as any[]).map(fieldToString).join(",");
  }
  return "*";
}