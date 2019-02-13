import { CstNode, IToken } from "chevrotain";
import { QuartzParser } from "../parser";
import { AbstractTree, Expression, intervalExpr, rangeExpr, StringLiteral } from "../syntax/BaseSyntax";
import { DayOfWeek, QuartzCronExpression } from "../syntax/QuartzSyntax";

const quartzVisitorConstructor = new QuartzParser().getBaseCstVisitorConstructor();
export class QuartzVisitor extends quartzVisitorConstructor {
  constructor() {
    super();
    // stuff
    this.validateVisitor();
  }

  cron(ctx: ICronContext) {
    return this.visit(ctx.cronExpression);
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

  expression(ctx: IExpressionContext) {
    const exprs = ctx.exprNotUnion.map(e => this.visit(e));
    return new Expression(exprs);
  }

  exprNotUnion(ctx: IExprNotUnionContext) {
    const lhs = new StringLiteral(ctx.lhs[0].image);
    return this.visit(ctx.atomicExpr, lhs);
  }

  atomicExpr(ctx: IAtomicExprContext, lhs: StringLiteral) {
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

  interval(ctx: IOperationContext) {
    return new StringLiteral(ctx.rhs[0].image);
  }

  range(ctx: IOperationContext) {
    return new StringLiteral(ctx.rhs[0].image);
  }

  dow(ctx: IDoWContext) {
    const occurence = ctx.occurence[0].image === "L" ? 5 : parseInt(ctx.occurence[0].image, 10);
    return new DayOfWeek(occurence);
  }
}

export interface ICronContext {
  cronExpression: CstNode;
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

interface IExpressionContext {
  exprNotUnion: CstNode[];
}

interface IExprNotUnionContext {
  lhs: IToken[];
  atomicExpr: CstNode;
}

interface IAtomicExprContext {
  interval?: CstNode;
  range?: CstNode;
  dow?: CstNode;
}

interface IOperationContext {
  rhs: IToken[];
}

interface IDoWContext {
  occurence: IToken[];
}
