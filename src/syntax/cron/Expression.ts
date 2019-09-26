import AbstractTree from "./AbstractTree";

export default class extends AbstractTree {
  protected _exprs: AbstractTree[];

  constructor(exprs: AbstractTree[]) {
    super();
    this._exprs = exprs;
  }

  value() {
    return this._exprs.map(e => e.value()).join(",");
  }
}
