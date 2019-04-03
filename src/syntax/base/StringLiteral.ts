import AbstractTree from "./AbstractTree";

export default class extends AbstractTree {
  protected readonly _value: string;
  constructor(value: string) {
    super();
    this._value = value;
  }

  value() {
    return this._value;
  }
}
