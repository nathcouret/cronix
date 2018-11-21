import { CronLexer } from "src/lexer";
import { CronParser } from "src/parser";

const parser = new CronParser();

function parse(input: string, startingRule: string) {
  const lexingResult = CronLexer.tokenize(input);
  parser.input = lexingResult.tokens;
  return parser.cronExpression();
}

test("stuff", () => {
  const output = parse("0", "atomicExpr");
  console.log(output);
});
