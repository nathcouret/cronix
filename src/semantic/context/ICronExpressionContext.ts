import { CstNode } from "chevrotain";

export interface ICronExpressionContext {
  minutes: CstNode;
  hours: CstNode;
  dom: CstNode;
  month: CstNode;
  dow: CstNode;
}
