import { SyntaxNode, CronExpression } from "@/common/syntax/cron";
import { everyExpr, anyExpr } from "@/common/syntax";

class QuartzCronExpression extends CronExpression {
  private _second: SyntaxNode;
  private _year: SyntaxNode;

  constructor(
    minute = everyExpr,
    hour = everyExpr,
    dom = everyExpr,
    month = everyExpr,
    dow = anyExpr,
    second = everyExpr,
    year = everyExpr
  ) {
    super(minute, hour, dom, month, dow);
    this._second = second;
    this._year = year;
  }

  value() {
    return `${this.second.value()} ${super.value()} ${this.year.value()}`;
  }

  get second() {
    return this._second;
  }

  set second(s: SyntaxNode) {
    this._second = s;
  }

  get year() {
    return this._year;
  }

  set year(v: SyntaxNode) {
    this._year = v;
  }
}

export default QuartzCronExpression;
