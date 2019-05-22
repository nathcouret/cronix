import { IToken, CstNode } from "chevrotain";

export interface IExprNotUnionContext {
  lhs: IToken[];
  atomicExpr: CstNode;
}
