import { ExprNotUnionContext } from "@/common/context";

import { CstNode } from "chevrotain";

export default interface QuartzExprNotUnionContext extends ExprNotUnionContext {
  dow?: CstNode;
}
