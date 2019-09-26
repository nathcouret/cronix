import { AbstractTree, anyExpr, CronExpression, everyExpr } from "../cron";

export default class extends CronExpression {
  private _second: AbstractTree;
  get second() {
    return this._second;
  }
  set second(s: AbstractTree) {
    this._second = s;
  }

  private _year: AbstractTree;
  get year() {
    return this._year;
  }
  set year(v: AbstractTree) {
    this._year = v;
  }

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
}
