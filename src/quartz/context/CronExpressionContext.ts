import { CstNode } from "chevrotain";
import { CronExpressionContext } from "@/common/context";

export default interface QuartzCronExpressionContext extends CronExpressionContext {
  second?: CstNode;
  year?: CstNode;
}
