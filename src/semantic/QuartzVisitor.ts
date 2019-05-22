import { CstNode, IToken } from "chevrotain";
import { QuartzParser } from "../parser";
import { AbstractTree, intervalExpr, rangeExpr, StringLiteral } from "../syntax/base";
import { DayOfWeekExpr, QuartzCronExpression } from "../syntax/quartz";
import abstractVisitor from "./AbstractVisitor";
import { IAtomicExprContext } from "./context";

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
  atomicExpr(ctx: IAtomicQuartzExprContext, lhs: StringLiteral) {
    let expr: AbstractTree = lhs;
    if (ctx.range) {
      expr = rangeExpr(lhs, this.visit(ctx.range));
    }
    if (ctx.interval) {
      expr = intervalExpr(expr, this.visit(ctx.interval));
    }
    if (ctx.dow) {
      expr = expr;
    }
    return expr;
  }
  dow(ctx: IDoWContext) {
    const occurence = ctx.occurence[0].image === "L" ? 5 : parseInt(ctx.occurence[0].image, 10);
    return new DayOfWeekExpr(occurence);
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

interface IAtomicQuartzExprContext extends IAtomicExprContext {
  dow?: CstNode;
}

interface IDoWContext {
  occurence: IToken[];
}
