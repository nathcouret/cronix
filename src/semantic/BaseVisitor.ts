import { CstNode, IToken } from "chevrotain";
import { baseVocabulary } from "../lexer";
import { BaseParser } from "../parser";
import { CronExpression, Expression, StringLiteral, rangeExpr } from "../syntax/BaseSyntax";
import { intervalExpr, AbstractTree } from "../syntax/syntax";

const BaseVisitorConstructor = new BaseParser(
  baseVocabulary
).getBaseCstVisitorConstructor();
export class BaseVisitor extends BaseVisitorConstructor {
  constructor() {
    super();
    // stuff
    this.validateVisitor();
  }

  public cron(ctx: CronContext) {
      return this.visit(ctx.cronExpression);
  }

  public cronExpression(ctx: CronExpressionContext) {
      const visitedContext = new CronExpression();
      visitedContext.minute = this.visit(ctx.minutes);
      visitedContext.hour = this.visit(ctx.hours);
      visitedContext.dom = this.visit(ctx.dom);
      visitedContext.month = this.visit(ctx.month);
      visitedContext.dow = this.visit(ctx.dow);
      return visitedContext;
  }

  public expression(ctx: ExpressionContext) {
      const exprs = ctx.exprNotUnion.map(e => this.visit(e));
      return new Expression(exprs);
  }

  public exprNotUnion(ctx: ExprNotUnionContext) {
      const lhs = new StringLiteral(ctx.lhs[0].image);
      return this.visit(ctx.atomicExpr, lhs);
  }

  public atomicExpr(ctx: AtomicExprContext, lhs: StringLiteral) {
      let expr: AbstractTree = lhs;
      if(ctx.range) {
          expr = intervalExpr(lhs, this.visit(ctx.range));
      }
      if(ctx.interval) {
          expr = rangeExpr(expr, this.visit(ctx.interval));
      }
      return expr;
  }

  public interval(ctx: OperationContext) {
    return new StringLiteral(ctx.rhs[0].image);
  }

  public range(ctx: OperationContext) {
    return new StringLiteral(ctx.rhs[0].image);
  }

}

export interface CronContext {
  cronExpression: CstNode;
}

interface CronExpressionContext {
  minutes: CstNode;
  hours: CstNode;
  dom: CstNode;
  month: CstNode;
  dow: CstNode;
}

interface ExpressionContext {
  exprNotUnion: CstNode[];
}

interface ExprNotUnionContext {
  lhs: IToken[];
  atomicExpr: CstNode;
}

interface AtomicExprContext {
  interval?: CstNode;
  range?: CstNode;
}

interface OperationContext {
  rhs: IToken[];
}
