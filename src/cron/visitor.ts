import { CronParser } from "./parser";
import abstractVisitor from "@/common/AbstractVisitorConstructor";

const CronVisitorConstructor = abstractVisitor(new CronParser().getBaseCstVisitorConstructor());
export class CronVisitor extends CronVisitorConstructor {
  constructor() {
    super(CronVisitorConstructor);
  }
}
