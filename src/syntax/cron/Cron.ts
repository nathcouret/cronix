import AbstractTree from "./AbstractTree";

export default class Cron<T extends AbstractTree> extends AbstractTree {
  protected cronExpression!: T;

  value() {
    return this.cronExpression.value();
  }
}
