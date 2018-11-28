import { CronLexer, baseVocabulary } from "../src/lexer";
import { BaseParser } from "../src/parser";

const parser = new BaseParser(baseVocabulary);

function parse(input: string, startingRule: string) {
  const lexingResult = CronLexer.tokenize(input);
  parser.input = lexingResult.tokens;
  return parser.cronExpression();
}

test("stuff", () => {
  const output = parse("0", "atomicExpr");
  console.log(output);
});
