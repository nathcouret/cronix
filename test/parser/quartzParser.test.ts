import { baseVocabulary, baseTokens, quartzTokens, quartzVocabulary } from "../../src/lexer";
import { BaseParser, QuartzParser } from "../../src/parser";
import { Lexer, NotAllInputParsedException, EarlyExitException, Parser } from "chevrotain";

const lexer = new Lexer(quartzTokens);
const parser = new QuartzParser();

function parse(input: string) {
    const lexingResult = lexer.tokenize(input);
    parser.input = lexingResult.tokens;
    return parser.cron();
}

describe("parser", () => {
    test("a simple valid expression", () => {
        // Given
        // Everyday at 04:05
        const expression = "0 5 4 * * ?";
        // When
        const parsed = parse(expression);
        // Then
        expect(parser.errors).toEqual([]);
    });

    test("a simple valid expression with year", () => {
        // Given
        // Everyday at 04:05
        const expression = "0 5 4 * * ? *";
        // When
        const parsed = parse(expression);
        // Then
        expect(parser.errors).toEqual([]);
    });
});