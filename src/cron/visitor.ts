import abstractVisitor from "@/common/AbstractVisitorConstructor";
import { CronCstParser } from "@/cron/cstParser";

const CronVisitorConstructor = abstractVisitor(new CronCstParser().getBaseCstVisitorConstructor());

export class CronVisitor extends CronVisitorConstructor {
  constructor() {
    super(CronVisitorConstructor);
  }
}
