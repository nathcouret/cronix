import { CstNode, IToken } from "chevrotain";
import { QuartzParser } from "../parser";
import { AbstractTree, intervalExpr, rangeExpr, StringLiteral } from "../syntax/base";
import { DayOfWeekExpr, QuartzCronExpression } from "../syntax/quartz";
import abstractVisitor from "./AbstractVisitor";
import { IAtomicExprContext, IExprNotUnionContext } from "./context";

const QuartzVisitorConstructor = abstractVisitor(new QuartzParser().getBaseCstVisitorConstructor());
export class QuartzVisitor extends QuartzVisitorConstructor {
  constructor() {
    super(QuartzVisitorConstructor);
  }

  cronExpression(ctx: ICronExpressionContext) {
    const visitedContext = new QuartzCronExpression();
    if (ctx.second) {
      visitedContext.second = this.visit(ctx.second);
    }
    visitedContext.minute = this.visit(ctx.minutes);
    visitedContext.hour = this.visit(ctx.hours);
    visitedContext.dom = this.visit(ctx.dom);
    visitedContext.month = this.visit(ctx.month);
    visitedContext.dow = this.visit(ctx.dow);
    if (ctx.year) {
      visitedContext.year = this.visit(ctx.year);
    }
    return visitedContext;
  }

  exprNotUnion(ctx: IQuartzExprNotUnionContext) {
    const lhs = new StringLiteral(ctx.lhs[0].image);
    if (ctx.dow) {
      return this.visit(ctx.dow, lhs);
    }
    return this.visit(ctx.atomicExpr, lhs);
  }

  dow(ctx: IDoWContext, lhs: StringLiteral) {
    const occurence = ctx.occurence[0].image === "L" ? 5 : parseInt(ctx.occurence[0].image, 10);
    return new DayOfWeekExpr(lhs, occurence);
  }
}
interface ICronExpressionContext {
  second?: CstNode;
  minutes: CstNode;
  hours: CstNode;
  dom: CstNode;
  month: CstNode;
  dow: CstNode;
  year?: CstNode;
}

interface IQuartzExprNotUnionContext extends IExprNotUnionContext {
  dow?: CstNode;
}

interface IDoWContext {
  occurence: IToken[];
}
