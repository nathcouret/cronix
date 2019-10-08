import SyntaxNode from "./SyntaxNode";

export default class Cron<T extends SyntaxNode = SyntaxNode> implements SyntaxNode {
  protected cronExpression!: T;
  get expression() {
    return this.cronExpression;
  }

  value() {
    return this.cronExpression.value();
  }
}
