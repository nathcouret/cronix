import SyntaxNode from "./SyntaxNode";

export default class DualExpression implements SyntaxNode {
  protected _rhs: SyntaxNode;
  protected _lhs: SyntaxNode;
  protected _separator: string;

  constructor(lhs: SyntaxNode, rhs: SyntaxNode, separator: string) {
    this._rhs = rhs;
    this._lhs = lhs;
    this._separator = separator;
  }

  value() {
    return `${this._lhs.value()}${this._separator}${this._rhs.value()}`;
  }
}
