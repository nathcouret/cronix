import { CstNode, CstParser, TokenVocabulary } from "chevrotain";
import { comma, dash, identifier, slash } from "./lexer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CstRule = (idxInCallingRule?: number, ...args: any[]) => CstNode;

export class BaseCstParser extends CstParser {


  constructor(vocabulary: TokenVocabulary, invokedByChild = false) {
    super(vocabulary);
    if (!invokedByChild) {
      this.performSelfAnalysis();
    }
  }

  readonly cronExpression: CstRule = this.RULE("cronExpression", () => {
    // Minutes
    this.SUBRULE1(this.expression, { LABEL: "minutes" });
    // Hours
    this.SUBRULE2(this.expression, { LABEL: "hours" });
    // Day of month
    this.SUBRULE3(this.expression, { LABEL: "dom" });
    // Month
    this.SUBRULE4(this.expression, { LABEL: "month" });
    // Day of week
    this.SUBRULE5(this.expression, { LABEL: "dow" });
  });

  readonly expression: CstRule = this.RULE("expression", () => {
    this.AT_LEAST_ONE_SEP({
      SEP: comma,
      DEF: () => this.SUBRULE(this.exprNotUnion)
    });
  });

  readonly exprNotUnion: CstRule = this.RULE("exprNotUnion", () => {
    this.CONSUME(identifier, { LABEL: "lhs" });
    this.SUBRULE(this.atomicExpr);
  });

  readonly atomicExpr: CstRule = this.RULE("atomicExpr", () => {
    this.OPTION1({
      DEF: () => this.SUBRULE1(this.range)
    });
    this.OPTION2({
      DEF: () => this.SUBRULE2(this.interval)
    });
  });

  readonly interval: CstRule = this.RULE("interval", () => {
    this.CONSUME1(slash);
    this.CONSUME2(identifier, { LABEL: "rhs" });
  });

  readonly range: CstRule = this.RULE("range", () => {
    this.CONSUME1(dash);
    this.CONSUME2(identifier, { LABEL: "rhs" });
  });
}
