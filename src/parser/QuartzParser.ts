import {
  Any,
  Days,
  Integer,
  Last,
  Months,
  quartzVocabulary,
  Sharp
} from "../lexer";
import { BaseParser } from "./BaseParser";
import { IAnyOrAlt, IToken } from "chevrotain";

export class QuartzParser extends BaseParser {
  constructor() {
    super(quartzVocabulary);
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
    this.SUBRULE(this.atomicExpr, { LABEL: "lhs" });
    this.OPTION({
      DEF: () =>
        this.OR([
          { ALT: () => this.SUBRULE(this.interval) },
          { ALT: () => this.SUBRULE(this.range) },
          { ALT: () => this.SUBRULE(this.dow) }
        ])
    });
  });

  readonly extendedAtomicExpr = [
    {
      ALT: () => this.CONSUME(Months)
    },
    {
      ALT: () => this.CONSUME(Days)
    },
    { ALT: () => this.CONSUME(Any) }
  ];

  readonly atomicExpr = this.OVERRIDE_RULE("atomicExpr", () => {
    this.OR([...this.baseAtomics, ...this.extendedAtomicExpr]);
  });

  // Day of week
  private readonly dow = this.RULE("dow", () => {
    this.OR([
      { ALT: () => this.CONSUME(Last) },
      {
        ALT: () => {
          this.CONSUME(Sharp);
          this.CONSUME(Integer);
        }
      }
    ]);
  });
}
