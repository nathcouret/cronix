import AbstractTree from "./AbstractTree";
import SyntaxNode from "./SyntaxNode";

export default class Cron<T extends SyntaxNode> implements SyntaxNode {
  protected cronExpression!: T;

  value() {
    return this.cronExpression.value();
  }
}
