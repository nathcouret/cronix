import { CstNode } from "chevrotain";
import { CronExpressionContext } from "../CronExpressionContext";

export default interface QuartzCronExpressionContext extends CronExpressionContext {
  second?: CstNode;
  year?: CstNode;
}
