import DualExpression from "@/syntax/cron/DualExpression";
import StringLiteral from "@/syntax/cron/StringLiteral";
import { SyntaxNode } from "@/syntax/cron";

/**
 * Convenience method to build an interval expression.
 * @param lhs The value to repeat
 * @param step The step value
 * @return A step expression
 */
export function stepExpr(lhs: SyntaxNode, step: StringLiteral) {
  return new DualExpression(lhs, step, "/");
}

/**
 * Convenience function to build a range expression.
 * @param start The start value
 * @param end The end value
 */
export function rangeExpr(start: SyntaxNode, end: SyntaxNode) {
  return new DualExpression(start, end, "-");
}

/**
 * Alias node for the * value
 */
export const everyExpr = new StringLiteral("*");
/**
 * Alias node for the ? value
 */
export const anyExpr = new StringLiteral("?");
