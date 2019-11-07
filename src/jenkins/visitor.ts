import { JenkinsParser } from "./parser";
import abstractVisitor from "@/common/AbstractVisitorConstructor";

const JenkinsVisitorConstructor = abstractVisitor(new JenkinsParser().getBaseCstVisitorConstructor());
export class JenkinsVisitor extends JenkinsVisitorConstructor {
  constructor() {
    super(JenkinsVisitorConstructor);
  }
}
