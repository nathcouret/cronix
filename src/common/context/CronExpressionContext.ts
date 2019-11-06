import { CstNode } from "chevrotain";

export interface CronExpressionContext {
  minutes: CstNode;
  hours: CstNode;
  dom: CstNode;
  month: CstNode;
  dow: CstNode;
}
