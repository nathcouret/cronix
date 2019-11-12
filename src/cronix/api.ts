import CronixParser, { CronixParserException } from "./CronixParser";
import CronixMode from "./CronixMode";
import CronixExpression from "./CronixExpression";
import CronixOptions from "./CronixOptions";
import { CronExpression } from "@/common";

export interface ParseResult {
  value: CronExpression | null;
  errors: CronixParserException[];
}

/**
 * Parse an expression. If the underlying parser encounters an error it the resulting expression will be null and you will find errors information in the result object.
 * Note that this function create a new parser instance for each call, so avoid this approach in favor of the CronixParse instance if possible.
 * @param expression The expression to parse
 * @param options The parser's options
 */
export default function parse(expression: string | CronixExpression, options: CronixOptions = { mode: CronixMode.CRONTAB }): ParseResult {
  const parser = new CronixParser(options);
  const value = parser.parse(expression);
  return {
    value,
    errors: parser.errors
  };
}
