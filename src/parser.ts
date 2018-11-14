import { Parser } from "chevrotain";
import { cronVocabulary, Days, Months, Integer, Dash, Last, Sharp, Slash, Comma, Any, Every } from "./lexer";

export class CronParser extends Parser {
  constructor() {
    super(cronVocabulary);

    this.cronExpression();

    this.performSelfAnalysis();
  }

  public readonly cronExpression = this.RULE("cronExpression", () => {
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

  public readonly expression = this.RULE("expression", () => {
    this.AT_LEAST_ONE_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.exprNotUnion)
    });
  });

  public readonly exprNotUnion = this.RULE("exprNotUnion", () => {
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

  public readonly interval = this.RULE("interval", () => {
    this.CONSUME(Slash);
    this.SUBRULE(this.atomicExpr, { LABEL: "rhs" });
  });

  public readonly range = this.RULE("range", () => {
    this.CONSUME(Dash);
    this.SUBRULE(this.atomicExpr, { LABEL: "rhs" });
  });

  public readonly atomicExpr = this.RULE("atomicExpr", () => {
    this.OR([
      {
        ALT: () => this.CONSUME(Integer)
      },
      {
        ALT: () => this.CONSUME(Months)
      },
      {
        ALT: () => this.CONSUME(Days)
      },
      { ALT: () => this.CONSUME(Any) },
      { ALT: () => this.CONSUME(Every) }
    ]);
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
