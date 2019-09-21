import AbstractTree from "./AbstractTree";
import DualExpression from "./DualExpression";
import StringLiteral from "./StringLiteral";

export { default as AbstractTree } from "./AbstractTree";
export { default as Cron } from "./Cron";
export { default as CronExpression } from "./CronExpression";
export { default as DualExpression } from "./DualExpression";
export { default as ISyntax } from "./Syntax";
export { default as StringLiteral } from "./StringLiteral";
export { default as Expression } from "./Expression";

export function intervalExpr(lhs: AbstractTree, rhs: AbstractTree) {
  return new DualExpression(lhs, rhs, "/");
}

export function rangeExpr(lhs: AbstractTree, rhs: AbstractTree) {
  return new DualExpression(lhs, rhs, "-");
}

export const everyExpr = new StringLiteral("*");
export const anyExpr = new StringLiteral("?");
