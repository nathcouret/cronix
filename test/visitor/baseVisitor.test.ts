import { Lexer } from "chevrotain";
import { baseTokens, baseVocabulary } from "../../src/lexer";
import { BaseParser } from "../../src/parser";
import { BaseVisitor } from "../../src/semantic/BaseVisitor";
import { CronExpression } from "../../src/syntax/syntax";

const parser = new BaseParser(baseVocabulary);
const lexer = new Lexer(baseTokens);

function parse(input: string) {
  const lexingResult = lexer.tokenize(input);
  parser.input = lexingResult.tokens;
  return parser.cron();
}

describe('BaseVisitor', () => {
    test('a simple expression', () => {
        // Given
        // Everyday at 04:05
        const expression = "5 4 * * *";
        // When
        const cst = parse(expression);
        const ast: CronExpression = new BaseVisitor().visit(cst);
        // Then
        expect(parser.errors).toEqual([]);
        expect(ast.minute.value()).toEqual("5");
        expect(ast.hour.value()).toEqual("4");
        expect(ast.dom.value()).toEqual("*");
        expect(ast.month.value()).toEqual("*");
        expect(ast.dow.value()).toEqual("*");
    });
});
