import SyntaxNode from "./SyntaxNode";
import { everyExpr } from "@/syntax/common";

export default class CronExpression implements SyntaxNode {
  protected _minute: SyntaxNode;
  get minute() {
    return this._minute;
  }
  set minute(v: SyntaxNode) {
    this._minute = v;
  }

  protected _hour: SyntaxNode;
  get hour() {
    return this._hour;
  }
  set hour(v: SyntaxNode) {
    this._hour = v;
  }

  protected _dom: SyntaxNode;
  get dom() {
    return this._dom;
  }
  set dom(v: SyntaxNode) {
    this._dom = v;
  }

  protected _month: SyntaxNode;
  get month() {
    return this._month;
  }
  set month(v: SyntaxNode) {
    this._month = v;
  }

  protected _dow: SyntaxNode;
  get dow() {
    return this._dow;
  }
  set dow(dow: SyntaxNode) {
    this._dow = dow;
  }

  constructor(minute = everyExpr, hour = everyExpr, dom = everyExpr, month = everyExpr, dow = everyExpr) {
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
