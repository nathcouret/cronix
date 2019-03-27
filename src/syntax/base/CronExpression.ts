import AbstractTree from "./AbstractTree";

export default class CronExpression extends AbstractTree {
  protected _minute: AbstractTree;
  get minute() {
    return this._minute;
  }
  set minute(v: AbstractTree) {
    this._minute = v;
  }

  protected _hour: AbstractTree;
  get hour() {
    return this._hour;
  }
  set hour(v: AbstractTree) {
    this._hour = v;
  }

  protected _dom: AbstractTree;
  get dom() {
    return this._dom;
  }
  set dom(v: AbstractTree) {
    this._dom = v;
  }

  protected _month: AbstractTree;
  get month() {
    return this._month;
  }
  set month(v: AbstractTree) {
    this._month = v;
  }

  protected _dow: AbstractTree;
  get dow() {
    return this._dow;
  }
  set dow(dow: AbstractTree) {
    this._dow = dow;
  }

  constructor(minute = everyExpr, hour = everyExpr, dom = everyExpr, month = everyExpr, dow = everyExpr) {
    super();
    this._dow = dow;
    this._minute = minute;
    this._hour = hour;
    this._dom = dom;
    this._month = month;
  }

  value() {
    return ` ${this._minute.value()} ${this._hour.value()} ${this._dom.value()} ${this._month.value()} ${this._dow.value()}`;
  }
}
