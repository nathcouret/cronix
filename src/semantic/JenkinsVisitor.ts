import { JenkinsParser } from "../parser";
import abstractVisitor from "./AbstractVisitor";

const JenkinsVisitorConstructor = abstractVisitor(new JenkinsParser().getBaseCstVisitorConstructor());
export default class JenkinsVisitor extends JenkinsVisitorConstructor {
  constructor() {
    super(JenkinsVisitorConstructor);
  }
}
