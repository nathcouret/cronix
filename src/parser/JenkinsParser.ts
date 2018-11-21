import { IAnyOrAlt, IToken } from "chevrotain";
import { jenkinsVocabulary, RoundTime } from "../lexer";
import { BaseParser } from "./BaseParser";

export class JenkinsParser extends BaseParser {
  constructor() {
    super(jenkinsVocabulary);
    this.performSelfAnalysis();
  }

  public extendedAtomicExpr = [
    {
      ALT: () => this.CONSUME(RoundTime)
    }
  ];

  readonly atomicExpr = this.OVERRIDE_RULE("atomicExpr", () => {
    this.OR([...this.baseAtomics, ...this.extendedAtomicExpr]);
  });
}
