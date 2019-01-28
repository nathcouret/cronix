import { createSyntaxDiagramsCode } from "chevrotain";
import { writeFile, writeFileSync } from "fs";
import { baseVocabulary } from "./src/lexer";
import { BaseParser, JenkinsParser, QuartzParser } from "./src/parser";

// Just doing lots of testing in there
const quartzParser = new QuartzParser();
const cronParser = new BaseParser(baseVocabulary);
const jenkinsParser = new JenkinsParser();

// Parse the tokens into a CST
//parser.cronExpression();

// Grammar diagram generation
const quartzGrammar = quartzParser.getSerializedGastProductions();
const cronGrammar = cronParser.getSerializedGastProductions();
const jenkinsGrammar = jenkinsParser.getSerializedGastProductions();
// Write the HTML file to disk
writeFileSync("./grammar/quartz.html", createSyntaxDiagramsCode(quartzGrammar));
writeFileSync("./grammar/cron.html", createSyntaxDiagramsCode(cronGrammar));
writeFileSync("./grammar/jenkins.html", createSyntaxDiagramsCode(jenkinsGrammar));


// Semantic analysis
//const ast = cronVisitor.visit(cst);

//writeFileSync("/ast.json", JSON.stringify(ast));
// // Generate the cron expression from the AST
// writeFileSync(outPath + "/cron.txt", ast.value());
