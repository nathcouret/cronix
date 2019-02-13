export interface ISyntax {
  value(): string;
}

export abstract class AbstractTree implements ISyntax {
  abstract value(): string;
}

export class Cron extends AbstractTree {
  protected cronExpression!: CronExpression;

  value() {
    return this.cronExpression.value();
  }
}

export class CronExpression extends AbstractTree {
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

export class Expression extends AbstractTree {
  protected _exprs: AbstractTree[];

  constructor(exprs: AbstractTree[]) {
    super();
    this._exprs = exprs;
  }

  value() {
    return this._exprs.map(e => e.value()).join(",");
  }
}

export class DualExpression extends AbstractTree {
  protected _rhs: AbstractTree;
  protected _lhs: AbstractTree;
  protected _separator: string;

  constructor(lhs: AbstractTree, rhs: AbstractTree, separator: string) {
    super();
    this._rhs = rhs;
    this._lhs = lhs;
    this._separator = separator;
  }

  value() {
    return `${this._lhs.value()}${this._separator}${this._rhs.value()}`;
  }
}
export function intervalExpr(lhs: AbstractTree, rhs: AbstractTree) {
  return new DualExpression(lhs, rhs, "/");
}

export function rangeExpr(lhs: AbstractTree, rhs: AbstractTree) {
  return new DualExpression(lhs, rhs, "-");
}

export class StringLiteral extends AbstractTree {
  protected readonly _value: string;
  constructor(value: string) {
    super();
    this._value = value;
  }

  value() {
    return this._value;
  }
}
export const everyExpr = new StringLiteral("*");
export const anyExpr = new StringLiteral("?");
