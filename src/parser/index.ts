import { BaseParser } from "./BaseParser";

export * from "./BaseParser";
export * from "./QuartzParser";
export * from "./JenkinsParser";

export class Dummy extends BaseParser {
    extendedAtomicExpr= [];
}