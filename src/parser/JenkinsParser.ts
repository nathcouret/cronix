import { jenkinsVocabulary } from "../lexer";
import { BaseParser } from "./BaseParser";

export class JenkinsParser extends BaseParser {
  constructor() {
    super(jenkinsVocabulary, true);
    this.performSelfAnalysis();
  }
}
