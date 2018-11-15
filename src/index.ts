import { CronLexer } from "./lexer";
import { CronParser } from "./parser";
import {cronVisitor} from "./semantic";
import { createSyntaxDiagramsCode } from "chevrotain";
import { resolve } from "path";
import { writeFileSync } from "fs";


// Just doing lots of testing in there
const parser = new CronParser();
const lexingResult = CronLexer.tokenize("0 0 12 ? * 5L *");
parser.input = lexingResult.tokens;

const cst = parser.cronExpression();

if (parser.errors.length > 0) {
  console.log("o no " + parser.errors.length);
  console.log(parser.errors);
} else {
  console.log("oh yeah");
}

const ast = cronVisitor.visit(cst);

const serializedGrammar = parser.getSerializedGastProductions();

// create the HTML Text
const htmlText = createSyntaxDiagramsCode(serializedGrammar);

// Write the HTML file to disk
const outPath = resolve(__dirname, "./");
writeFileSync(outPath + "/generated_diagrams.html", htmlText);
writeFileSync(outPath + "/ast.json",JSON.stringify(ast));
writeFileSync(outPath + "/cron.txt", ast.value());
