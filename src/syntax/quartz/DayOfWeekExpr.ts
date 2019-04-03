import { AbstractTree } from "../base";

export default class extends AbstractTree {
  private _occurence: number;
  get occurence(): number {
    return this._occurence;
  }
  set occurence(v: number) {
    this._occurence = v;
  }

  constructor(occurence: number) {
    super();
    this._occurence = occurence;
  }

  value() {
    return this._occurence < 5 ? `#${this._occurence}` : `L`;
  }
}
