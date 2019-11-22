import { QuartzCstParser } from "./cstParser";
import { StringLiteral } from "@/common/syntax";
import { DayOfWeekExpr, QuartzCronExpression } from "./syntax";
import abstractVisitor from "@/common/AbstractVisitorConstructor";
import { DowContext, QuartzCronExpressionContext, QuartzExprNotUnionContext } from "./context";
import { InvalidValueException } from "@/common/syntax/InvalidValueException";

const QuartzVisitorConstructor = abstractVisitor(new QuartzCstParser().getBaseCstVisitorConstructor());

export class QuartzVisitor extends QuartzVisitorConstructor {
  constructor() {
    super(QuartzVisitorConstructor, true);
    this.validateVisitor();
  }

  cronExpression(ctx: QuartzCronExpressionContext) {
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

  exprNotUnion(ctx: QuartzExprNotUnionContext) {
    const lhs = new StringLiteral(ctx.lhs[0].image);
    if (ctx.dow) {
      return this.visit(ctx.dow, lhs);
    }
    return this.visit(ctx.atomicExpr, lhs);
  }

  dow(ctx: DowContext, lhs: StringLiteral) {
    const occurrence = ctx.occurence[0].image === "L" ? 5 : parseInt(ctx.occurence[0].image, 10);
    if (occurrence > 5) {
      throw new InvalidValueException("Occurrence value in Day of week expression should be less than or equal to 5");
    }
    return new DayOfWeekExpr(lhs, occurrence);
  }
}
