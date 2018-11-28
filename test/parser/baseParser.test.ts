import { baseVocabulary, baseTokens } from "../../src/lexer";
import { BaseParser } from "../../src/parser";
import { Lexer, NotAllInputParsedException, EarlyExitException } from "chevrotain";

const parser = new BaseParser(baseVocabulary);
const lexer = new Lexer(baseTokens);

function parse(input: string) {
    const lexingResult = lexer.tokenize(input);
    parser.input = lexingResult.tokens;
    return parser.cron();
}

describe("parser", () => {
    test("a simple valid expression", () => {
        // Given
        // Everyday at 04:05
        const expression = "5 4 * * *";
        // When
        const parsed = parse(expression);
        // Then
        expect(parser.errors).toEqual([]);
    });

    test("Too many fields", () => {
        // Given
        // It takes a lot to make a stew
        const expression = "5 4 * * * *";
        // When
        parse(expression);
        // Then
        expect(parser.errors.length).toEqual(1);
        expect(parser.errors[0]).toBeInstanceOf(NotAllInputParsedException);
    })

    test("Too few fields", () => {
        // Given one field missing
        const expression = "5 4 * * ";
        // When
        parse(expression);
        // Then
        expect(parser.errors.length).toEqual(1);
        expect(parser.errors[0]).toBeInstanceOf(EarlyExitException);
    });
});