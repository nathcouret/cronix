import { CstNode, IToken } from "chevrotain";
import { CronParser } from "./parser";

const parser = new CronParser();
const BaseVisitor = parser.getBaseCstVisitorConstructor();

interface CronContext {
  seconds: CstNode;
  minutes: CstNode;
  hours: CstNode;
  dom: CstNode;
  month: CstNode;
  dow: CstNode;
  year?: CstNode;
}

interface ExpressionContext {
  exprNotUnion: CstNode[];
}

interface ExprNotUnionContext {
  lhs: CstNode;
  interval?: CstNode;
  range?: CstNode;
  dow?: CstNode;
}

interface OperationContext {
  rhs: IToken[];
}

interface AtomicContext {
  Integer?: IToken[];
  Days?: IToken[];
  Months?: IToken[];
  Any?: IToken[];
  Every?: IToken[];
}

interface dowContext {
  Sharp?: IToken[];
  Last?: IToken[];
  Integer?: IToken[];
}

export class CronVisitor extends BaseVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  public cronExpression(ctx: CronContext) {
    const visitedContext: any = {};
    visitedContext.seconds = this.visit(ctx.seconds);
    visitedContext.minutes = this.visit(ctx.minutes);
    visitedContext.hours = this.visit(ctx.hours);
    visitedContext.dom = this.visit(ctx.dom);
    visitedContext.month = this.visit(ctx.month);
    visitedContext.dow = this.visit(ctx.dow);
    if (ctx.year) {
      visitedContext.year = this.visit(ctx.year);
    }

    return {
      type: "cronExpression",
      ...visitedContext
    };
  }

  public expression(ctx: ExpressionContext) {
    const exprs = ctx.exprNotUnion.map(e => this.visit(e));

    return {
      type: "expression",
      exprs
    };
  }

  public exprNotUnion(ctx: ExprNotUnionContext) {
    const result: any = { type: "exprNotUnion" };
    result.lhs = this.visit(ctx.lhs);
    if (ctx.interval) {
      result.interval = this.visit(ctx.interval);
    } else if (ctx.range) {
      result.range = this.visit(ctx.range, result.lhs);
    } else if (ctx.dow) {
      result.range = this.visit(ctx.dow);
    }
    return result;
  }

  public interval(ctx: OperationContext) {
    const result: any = { type: "interval" };
    result.rhs = ctx.rhs[0].image;
    return result;
  }

  public range(ctx: OperationContext, lhs: string) {
    const result: any = { type: "range" };
    result.rhs = ctx.rhs[0].image;
    return result;
  }

  public atomicExpr(ctx: AtomicContext) {
    if (ctx.Integer) {
      return ctx.Integer[0].image;
    } else if (ctx.Months) {
      return ctx.Months[0].image;
    } else if (ctx.Days) {
      return ctx.Days[0].image;
    } else if (ctx.Any) {
      return ctx.Any[0].image;
    } else {
      return ctx.Every[0].image;
    }
  }

  public dow(ctx: dowContext) {
    const result: any = { type: "dayOfWeek" };
    if (ctx.Last) {
      result.modifier = ctx.Last[0].image;
    } else {
      result.modifier = ctx.Sharp[0].image + ctx.Integer[0].image;
    }
    return result;
  }
}

export const cronVisitor = new CronVisitor();
