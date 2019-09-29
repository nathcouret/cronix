import { cronVocabulary } from "@/lexer";
import { CronParser } from "@/parser";
import abstractVisitor from "./AbstractVisitorConstructor";

const CronVisitorConstructor = abstractVisitor(new CronParser(cronVocabulary).getBaseCstVisitorConstructor());
export default class CronVisitor extends CronVisitorConstructor {
  constructor() {
    super(CronVisitorConstructor);
  }
}
