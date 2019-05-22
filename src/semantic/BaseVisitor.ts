import { cronVocabulary } from "../lexer";
import { BaseParser } from "../parser";
import abstractVisitor from "./AbstractVisitor";

const BaseVisitorConstructor = abstractVisitor(new BaseParser(cronVocabulary).getBaseCstVisitorConstructor());
export class BaseVisitor extends BaseVisitorConstructor {
  constructor() {
    super(BaseVisitorConstructor);
  }
}
