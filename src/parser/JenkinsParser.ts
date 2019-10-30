import { jenkinsVocabulary } from "@/lexer";
import { CronParser } from "./CronParser";

export class JenkinsParser extends CronParser {
  constructor() {
    super(jenkinsVocabulary, true);
    this.performSelfAnalysis();
  }
}
