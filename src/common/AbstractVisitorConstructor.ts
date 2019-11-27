/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICstVisitor } from "chevrotain";
import { CronExpression, Expression, rangeExpr, stepExpr, StringLiteral, SyntaxNode } from "@/common/syntax";
import {
  AtomicExprContext,
  CronExpressionContext,
  ExpressionContext,
  ExprNotUnionContext,
  OperationContext
} from "./context";

export type AbstractVisitor = ICstVisitor<any, any>;
export type AbstractVisitorConstructor = new (...args: any[]) => AbstractVisitor;

const abstractVisitor = <T extends AbstractVisitorConstructor>(base: T) => {
  class Visitor extends base {
    constructor(...args: any[]) {
      super(args);

      this.validateVisitor();
    }

    cronExpression(ctx: CronExpressionContext) {
      const visitedContext = new CronExpression();
      visitedContext.minute = this.visit(ctx.minutes);
      visitedContext.hour = this.visit(ctx.hours);
      visitedContext.dom = this.visit(ctx.dom);
      visitedContext.month = this.visit(ctx.month);
      visitedContext.dow = this.visit(ctx.dow);
      return visitedContext;
    }

    expression(ctx: ExpressionContext) {
      const exprs = ctx.exprNotUnion.map(e => this.visit(e));
      return new Expression(exprs);
    }

    exprNotUnion(ctx: ExprNotUnionContext) {
      const lhs = new StringLiteral(ctx.lhs[0].image);
      return this.visit(ctx.atomicExpr, lhs);
    }

    atomicExpr(ctx: AtomicExprContext, lhs: StringLiteral) {
      let expr: SyntaxNode = lhs;
      if (ctx.range) {
        const rhs: StringLiteral = this.visit(ctx.range);
        const leftValue = Number(lhs.value());
        const rightValue = Number(rhs.value());
        if (!isNaN(leftValue) && !isNaN(rightValue)) {
          if (leftValue > rightValue) {
            throw new Error("Left-hand side range value must be smaller than right-hand side");
          }
        }
        expr = rangeExpr(lhs, rhs);
      }
      if (ctx.interval) {
        expr = stepExpr(expr, this.visit(ctx.interval));
      }
      return expr;
    }

    interval(ctx: OperationContext) {
      return new StringLiteral(ctx.rhs[0].image);
    }

    range(ctx: OperationContext) {
      return new StringLiteral(ctx.rhs[0].image);
    }
  }

  return Visitor;
};

export default abstractVisitor;
