import { Identifier, Integer, Last, quartzVocabulary, Sharp } from "../lexer";
import { BaseParser } from "./BaseParser";

export class QuartzParser extends BaseParser {
  constructor() {
    super(quartzVocabulary, true);
    this.performSelfAnalysis();
  }

  readonly cronExpression = this.OVERRIDE_RULE("cronExpression", () => {
    // Seconds
    this.SUBRULE1(this.expression, { LABEL: "seconds" });
    // Minutes
    this.SUBRULE2(this.expression, { LABEL: "minutes" });
    // Hours
    this.SUBRULE3(this.expression, { LABEL: "hours" });
    // Day of month
    this.SUBRULE4(this.expression, { LABEL: "dom" });
    // Month
    this.SUBRULE5(this.expression, { LABEL: "month" });
    // Day of week
    this.SUBRULE6(this.expression, { LABEL: "dow" });
    // Optional year
    this.OPTION({
      DEF: () => this.SUBRULE7(this.expression, { LABEL: "year" })
    });
  });

  readonly exprNotUnion = this.OVERRIDE_RULE("exprNotUnion", () => {
    this.CONSUME(Identifier, { LABEL: "lhs" });
    this.OPTION({
      DEF: () => this.OR([{ ALT: () => this.SUBRULE(this.dow) }, { ALT: () => this.SUBRULE(this.atomicExpr) }])
    });
  });

  // Day of week
  private readonly dow = this.RULE("dow", () => {
    this.OR([
      { ALT: () => this.CONSUME(Last, { LABEL: "occurence" }) },
      {
        ALT: () => {
          this.CONSUME1(Sharp);
          this.CONSUME2(Integer, { LABEL: "occurence" });
        }
      }
    ]);
  });
}
