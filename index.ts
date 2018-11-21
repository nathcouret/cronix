import { createSyntaxDiagramsCode } from "chevrotain";
import { writeFileSync } from "fs";
import { resolve } from "path";
import { baseVocabulary, CronLexer } from "./src/lexer";
import { cronVisitor } from "./src/semantic";
import { BaseParser } from "src/parser";

// Just doing lots of testing in there
const parser = new BaseParser(baseVocabulary);
// Parse the input into tokens
const lexingResult = CronLexer.tokenize("0 0 12 * * * *");
parser.input = lexingResult.tokens;

// Parse the tokens into a CST
const cst = parser.cron();

if (parser.errors.length > 0) {
  console.log("o no " + parser.errors.length);
  console.log(parser.errors);
} else {
  console.log("oh yeah");
}
// Grammar diagram generation
const serializedGrammar = parser.getSerializedGastProductions();
// create the HTML Text
const htmlText = createSyntaxDiagramsCode(serializedGrammar);
// Write the HTML file to disk
const outPath = resolve(__dirname, "./");
writeFileSync(outPath + "/generated_diagrams.html", htmlText);

// Semantic analysis
const ast = cronVisitor.visit(cst);

writeFileSync(outPath + "/ast.json", JSON.stringify(ast));
// Generate the cron expression from the AST
writeFileSync(outPath + "/cron.txt", ast.value());
