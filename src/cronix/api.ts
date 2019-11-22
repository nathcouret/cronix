import { CronParser, JenkinsParser, ParserException, QuartzParser } from "./CronixParser";
import CronixMode from "./CronixMode";
import CronixExpression from "./CronixExpression";
import { CronExpression } from "@/common";

export interface ParseResult {
  value: CronExpression | null;
  errors: ParserException[];
}

function getParser(mode: CronixMode) {
  switch (mode) {
    case CronixMode.JENKINS:
      return new JenkinsParser();
    case CronixMode.QUARTZ:
      return new QuartzParser();
    case CronixMode.CRONTAB:
    default:
      return new CronParser();
  }
}

/**
 * Parse an expression. If the underlying parser encounters an error it the resulting expression will be null and you will find errors information in the result object.
 * Note that this function create a new parser instance for each call, so avoid this approach in favor of the CronixParse instance if possible.
 * @param expression The expression to parse
 * @param mode The mode the parser operates in
 */
export default function parse(expression: string | CronixExpression, mode = CronixMode.CRONTAB): ParseResult {
  const parser = getParser(mode);
  const value = parser.parse(expression);
  return {
    value: parser.errors.length > 0 ? null : value,
    errors: parser.errors
  };
}

