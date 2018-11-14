import { CstNode, IToken } from "chevrotain";
import { CronParser } from "./parser";
import { anyExpr, Cron, DayOfWeekExpression, everyExpr, Expression, intervalExpr, rangeExpr, StringLiteral } from "./syntax";

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
    const visitedContext: Cron = new Cron();
    visitedContext.second = this.visit(ctx.seconds);
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

  public expression(ctx: ExpressionContext) {
    const exprs = ctx.exprNotUnion.map(e => this.visit(e));
    return new Expression(exprs);
  }

  public exprNotUnion(ctx: ExprNotUnionContext) {
    const lhs = this.visit(ctx.lhs);
    if (ctx.interval) {
      return intervalExpr(lhs, this.visit(ctx.interval));
    } else if (ctx.range) {
      return rangeExpr(lhs, this.visit(ctx.range));
    } else if (ctx.dow) {
      return new DayOfWeekExpression(lhs, this.visit(ctx.dow));
    }
    return lhs;
  }

  public interval(ctx: OperationContext) {
    return new StringLiteral(ctx.rhs[0].image);
  }

  public range(ctx: OperationContext, lhs: string) {
    return new StringLiteral(ctx.rhs[0].image);
  }

  public atomicExpr(ctx: AtomicContext) {
    if (ctx.Integer) {
      return new StringLiteral(ctx.Integer[0].image);
    } else if (ctx.Months) {
      return new StringLiteral(ctx.Months[0].image);
    } else if (ctx.Days) {
      return new StringLiteral(ctx.Days[0].image);
    } else if (ctx.Any) {
      return anyExpr;
    } else if (ctx.Every) {
      return everyExpr;
    }
  }

  public dow(ctx: dowContext) {
    if (ctx.Last) {
      return new StringLiteral("5");
    } else if (ctx.Sharp && ctx.Integer) {
      return new StringLiteral(ctx.Integer[0].image);
    }
    throw new Error();
  }
}

export const cronVisitor = new CronVisitor();
