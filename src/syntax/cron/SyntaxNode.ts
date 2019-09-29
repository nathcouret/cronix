/**
 * A node in the cron syntax tree.
 */
import { StringLiteral } from "@/syntax";

export default interface SyntaxNode {
  /**
   * Get the generated value for this node
   * @return The generated expression value
   */
  value(): string;
}

export function toStringNode(node: string|SyntaxNode) {
  return typeof node === "string" ? new StringLiteral(node) : node;
}
