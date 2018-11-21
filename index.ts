import { CronLexer } from "./src/lexer";
import { CronParser } from "./src/parser";
import {cronVisitor} from "./src/semantic";
import { createSyntaxDiagramsCode } from "chevrotain";
import { resolve } from "path";
import { writeFileSync } from "fs";


// Just doing lots of testing in there
const parser = new CronParser();
// Parse the input into tokens
const lexingResult = CronLexer.tokenize("0 0 12 ? * 5L *");
parser.input = lexingResult.tokens;

// Parse the tokens into a CST
const cst = parser.cronExpression();

if (parser.errors.length > 0) {
  console.log("o no " + parser.errors.length);
  console.log(parser.errors);
} else {
  console.log("oh yeah");
}

// Semantic analysis
const ast = cronVisitor.visit(cst);

// Grammar diagram generation 
const serializedGrammar = parser.getSerializedGastProductions();
// create the HTML Text
const htmlText = createSyntaxDiagramsCode(serializedGrammar);
// Write the HTML file to disk
const outPath = resolve(__dirname, "./");
writeFileSync(outPath + "/generated_diagrams.html", htmlText);

writeFileSync(outPath + "/ast.json",JSON.stringify(ast));
// Generate the cron expression from the AST
writeFileSync(outPath + "/cron.txt", ast.value());
