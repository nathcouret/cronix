import SyntaxNode from "./SyntaxNode";
import DualExpression from "./DualExpression";
import StringLiteral from "./StringLiteral";

export { default as Cron } from "./Cron";
export { default as CronExpression } from "./CronExpression";
export { default as DualExpression } from "./DualExpression";
export { default as SyntaxNode } from "./SyntaxNode";
export { default as StringLiteral } from "./StringLiteral";
export { default as Expression } from "./Expression";

export function intervalExpr(lhs: SyntaxNode, rhs: SyntaxNode) {
  return new DualExpression(lhs, rhs, "/");
}

export function rangeExpr(lhs: SyntaxNode, rhs: SyntaxNode) {
  return new DualExpression(lhs, rhs, "-");
}

export const everyExpr = new StringLiteral("*");
export const anyExpr = new StringLiteral("?");
