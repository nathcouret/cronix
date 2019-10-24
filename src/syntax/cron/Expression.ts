import SyntaxNode from "./SyntaxNode";

export default class implements SyntaxNode {
  protected _exprs: SyntaxNode[];

  constructor(exprs: SyntaxNode[]) {
    this._exprs = exprs;
  }

  value() {
    return this._exprs.map(e => e.value()).join(",");
  }
}
