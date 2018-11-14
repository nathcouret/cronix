export interface Syntax {
  value(): string;
}

export abstract class AbstractTree implements Syntax {
  abstract value(): string;
}

export class Cron extends AbstractTree {
  private _second: AbstractTree;
  get second() {
    return this._second;
  }
  set second(second: AbstractTree) {
    this._second = second;
  }

  private _minute: AbstractTree;
  get minute() {
    return this._minute;
  }
  set minute(v: AbstractTree) {
    this._minute = v;
  }

  private _hour: AbstractTree;
  get hour() {
    return this._hour;
  }
  set hour(v: AbstractTree) {
    this._hour = v;
  }

  private _dom: AbstractTree;
  get dom() {
    return this._dom;
  }
  set dom(v: AbstractTree) {
    this._dom = v;
  }

  private _month: AbstractTree;
  get month() {
    return this._month;
  }
  set month(v: AbstractTree) {
    this._month = v;
  }

  private _dow: AbstractTree;
  get dow() {
    return this._dow;
  }
  set dow(v: AbstractTree) {
    this._dow = v;
  }
  private _year: AbstractTree;
  get year() {
    return this._year;
  }

  set year(v: AbstractTree) {
    this._year = v;
  }

  constructor(
    second = everyExpr,
    minute = everyExpr,
    hour = everyExpr,
    dom = everyExpr,
    month = everyExpr,
    dow = anyExpr,
    year = everyExpr
  ) {
    super();
    this._second = second;
    this._minute = minute;
    this._hour = hour;
    this._dom = dom;
    this._month = month;
    this._dow = dow;
    this._year = year;
  }

  value() {
    return `${this._second.value()} ${this._minute.value()} ${this._hour.value()} ${this._dom.value()} ${this._month.value()} ${this._dow.value()} ${this._year.value()}`;
  }
}

export class Expression extends AbstractTree {
  private _exprs: AbstractTree[];

  constructor(exprs: AbstractTree[]) {
    super();
    this._exprs = exprs;
  }

  value() {
    return this._exprs.map(e => e.value()).join(",");
  }
}

export class DualExpression extends AbstractTree {
  private _rhs: AbstractTree;
  private _lhs: AbstractTree;
  private _separator: string;

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

export class DayOfWeekExpression extends AbstractTree {
  private readonly _day: AbstractTree;
  private readonly _occurence: number;

  constructor(day: AbstractTree, occurence: number | AbstractTree) {
    super();
    this._day = day;
    if (occurence instanceof AbstractTree) {
      this._occurence = parseInt(occurence.value());
    } else {
      this._occurence = occurence;
    }
  }

  value() {
    let suffix = "";
    if (this._occurence === 5) {
      suffix = "L";
    } else {
      suffix = `#${this._occurence}`;
    }
    return `${this._day.value()}${suffix}`;
  }
}

export class StringLiteral extends AbstractTree {
  private readonly _value: string;
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
export const sharpExpr = new StringLiteral("#");
export const lastExpr = new StringLiteral("L");
export const weekDayExpr = new StringLiteral("W");
