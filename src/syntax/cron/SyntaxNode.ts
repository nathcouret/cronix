/**
 * A node in the cron syntax tree.
 */
export default interface SyntaxNode {
  /**
   * Get the generated value for this node
   * @return The generated expression value
   */
  value(): string;
}
