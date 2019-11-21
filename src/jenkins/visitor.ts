import { JenkinsCstParser } from "./cstParser";
import abstractVisitor from "@/common/AbstractVisitorConstructor";

const JenkinsVisitorConstructor = abstractVisitor(new JenkinsCstParser().getBaseCstVisitorConstructor());
export class JenkinsVisitor extends JenkinsVisitorConstructor {
  constructor() {
    super(JenkinsVisitorConstructor);
  }
}
