import { ExprNotUnionContext } from "..";

import { CstNode } from "chevrotain";

export default interface QuartzExprNotUnionContext extends ExprNotUnionContext {
  dow?: CstNode;
}
