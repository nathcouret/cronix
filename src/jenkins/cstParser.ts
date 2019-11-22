import { jenkinsVocabulary } from "./lexer";
import { BaseCstParser } from "@/common";

export class JenkinsCstParser extends BaseCstParser {
  constructor() {
    super(jenkinsVocabulary, true);
    this.performSelfAnalysis();
  }
}
