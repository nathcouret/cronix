import { AbstractTree, StringLiteral } from "../cron";

export default class extends AbstractTree {
  private _occurence: number;
  private _leftValue: StringLiteral;
  get occurence(): number {
    return this._occurence;
  }
  set occurence(v: number) {
    this._occurence = v;
  }
  get leftValue() {
    return this._leftValue;
  }
  set leftValue(v: StringLiteral) {
    this._leftValue = v;
  }

  constructor(leftValue: StringLiteral, occurence: number) {
    super();
    this._leftValue = leftValue;
    this._occurence = occurence;
  }

  value() {
    const occurence = this._occurence < 5 ? `#${this._occurence}` : `L`;
    return `${this._leftValue.value()}${occurence}`;
  }
}
