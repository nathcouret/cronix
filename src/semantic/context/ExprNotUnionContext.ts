import { IToken, CstNode } from "chevrotain";

export interface ExprNotUnionContext {
  lhs: IToken[];
  atomicExpr: CstNode;
}
