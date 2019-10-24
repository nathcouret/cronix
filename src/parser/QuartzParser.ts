import { identifier, integer, last, quartzVocabulary, sharp } from "@/lexer";
import { CronParser } from "./CronParser";

export class QuartzParser extends CronParser {
  constructor() {
    super(quartzVocabulary, true);
    this.performSelfAnalysis();
  }

  readonly cronExpression = this.OVERRIDE_RULE("cronExpression", () => {
    // Seconds
    this.SUBRULE1(this.expression, { LABEL: "second" });
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
    this.CONSUME(identifier, { LABEL: "lhs" });
    this.OPTION({
      DEF: () => this.OR([{ ALT: () => this.SUBRULE(this.dow) }, { ALT: () => this.SUBRULE(this.atomicExpr) }])
    });
  });

  // Day of week
  private readonly dow = this.RULE("dow", () => {
    this.OR([
      { ALT: () => this.CONSUME(last, { LABEL: "occurence" }) },
      {
        ALT: () => {
          this.CONSUME1(sharp);
          this.CONSUME2(integer, { LABEL: "occurence" });
        }
      }
    ]);
  });
}
