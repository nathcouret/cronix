import SyntaxNode from "./SyntaxNode";

export default abstract class implements SyntaxNode {
  abstract value(): string;
}
