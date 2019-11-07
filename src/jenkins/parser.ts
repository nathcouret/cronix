import { jenkinsVocabulary } from "./lexer";
import { BaseParser } from "@/common";

export class JenkinsParser extends BaseParser {
  constructor() {
    super(jenkinsVocabulary, true);
    this.performSelfAnalysis();
  }
}
