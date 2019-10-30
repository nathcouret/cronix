import { StringLiteral, SyntaxNode } from "../cron";
import { InvalidValueException } from "@/syntax/InvalidValueException";

export default class DayOfWeekExpr implements SyntaxNode {
  private _occurrence: number;
  private _leftValue: StringLiteral;

  constructor(leftValue: StringLiteral, occurrence: number) {
    this._leftValue = leftValue;
    this._occurrence = occurrence;
  }

  value() {
    const occurrence = this._occurrence < 5 ? `#${this._occurrence}` : `L`;
    return `${this._leftValue.value()}${occurrence}`;
  }

  get occurrence(): number {
    return this._occurrence;
  }

  set occurrence(v: number) {
    if(v > 5) {
      throw new InvalidValueException("Occurrence value in Day of week expression should be less than or equal to 5");
    }
    this._occurrence = v;
  }

  get leftValue() {
    return this._leftValue;
  }

  set leftValue(v: StringLiteral) {
    this._leftValue = v;
  }

}
