import AbstractTree from "./AbstractTree";

export default class extends AbstractTree {
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
