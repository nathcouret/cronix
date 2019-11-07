import SyntaxNode from "./SyntaxNode";

export default class StringLiteral implements SyntaxNode {
  protected readonly _value: string;
  constructor(value: string) {
    this._value = value;
  }

  value() {
    return this._value;
  }
}
