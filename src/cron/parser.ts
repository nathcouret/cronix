import { baseVocabulary } from "@/common/lexer";
import { BaseParser } from "@/common";

export class CronParser extends BaseParser {
  constructor() {
    super(baseVocabulary);
  }
}
