import CronixParser from "./CronixParser";
import CronixMode from "./CronixMode";
import CronixExpression from "./CronixExpression";
import CronixOptions from "./CronixOptions";


/**
 * Parse an expression
 * @param expression The expression to parse
 * @param options The parser's options
 */
export default function parse(expression: string | CronixExpression, options: CronixOptions = { mode: CronixMode.CRONTAB }) {
  const parser = new CronixParser(options);
  return parser.parse(expression);
}
