import { CstNode, IToken } from "chevrotain";
import { baseVocabulary } from "../lexer";
import { BaseParser } from "../parser";
import { AbstractTree, CronExpression, Expression, intervalExpr, rangeExpr, StringLiteral } from "../syntax/BaseSyntax";

const baseVisitorConstructor = new BaseParser(baseVocabulary).getBaseCstVisitorConstructor();
export class BaseVisitor extends baseVisitorConstructor {
  constructor() {
    super();
    // stuff
    this.validateVisitor();
  }

  cron(ctx: ICronContext) {
    return this.visit(ctx.cronExpression);
  }

  cronExpression(ctx: ICronExpressionContext) {
    const visitedContext = new CronExpression();
    visitedContext.minute = this.visit(ctx.minutes);
    visitedContext.hour = this.visit(ctx.hours);
    visitedContext.dom = this.visit(ctx.dom);
    visitedContext.month = this.visit(ctx.month);
    visitedContext.dow = this.visit(ctx.dow);
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
    return expr;
  }

  interval(ctx: IOperationContext) {
    return new StringLiteral(ctx.rhs[0].image);
  }

  range(ctx: IOperationContext) {
    return new StringLiteral(ctx.rhs[0].image);
  }
}

export interface ICronContext {
  cronExpression: CstNode;
}

interface ICronExpressionContext {
  minutes: CstNode;
  hours: CstNode;
  dom: CstNode;
  month: CstNode;
  dow: CstNode;
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
}

interface IOperationContext {
  rhs: IToken[];
}
