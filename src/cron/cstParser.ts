import { baseVocabulary } from "@/common/lexer";
import { BaseCstParser } from "@/common";

export class CronCstParser extends BaseCstParser {
  constructor() {
    super(baseVocabulary);
  }
}
