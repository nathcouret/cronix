[![npm](https://img.shields.io/npm/v/cronix?style=flat-square)](https://npmjs.com/package/cronix)
[![codecov](https://codecov.io/gh/Ataww/cronix/branch/develop/graph/badge.svg)](https://codecov.io/gh/Ataww/cronix)

Cronix
==========

A cron parser/generator with support for multiple cron dialect such as Quartz or Jenkins.

## Installation

Add Cronix as a dependency using yarn

````bash
yarn add cronix
````

Or npm

````bash
npm install cronix
````

## Usage

To parse an expression simply call the cronix function. By default expression are parsed according to the standard crontab format.
You can specify the mode as a second parameter to change that behaviour.

````javascript
import { cronix, CronixMode } from "cronix";
// Every day at 00:00
// const expression = "0 0 * * *";
const expression = {
  minute: "0",
  hour: "0"
};

const parsedCron = cronix(expression);
const cronAst = parsedCron.value;
// Get the computed expression using the value() method
// should be equal to expression
console.log(cronAst.value());
// should be an empty array
console.log(parsedCron.errors);

expression.year = "*/2";

// Quartz supports a year field that is not available in standard cron
const parsedQuartz = cronix(expression, CronixMode.QUARTZ);
console.log(parsedQuartz.value.value());
````

Alternatively you can use the class parser. Choose the implementation relevant to the desired dialect.

````javascript
import { CronParser } from "cronix";

// Every day at 00:00
const expression = "0 0 * * *";
const parser = new CronParser();

const ast = parser.parse(expression);
// should be equal to expression
console.log(ast.value());
````

## API

### CronixExpression

An object representing an input expression. Can be used when you only need to fill some fields and want to leave the rest to their default value `*`.

| field | type | optional | description |
|-----------|------|----------|-------------|
| minute | `string` | yes | The minute field |
`| hour | `string` | yes | The hour field |
| dayOfMonth | `string` | yes | The dayOfMonth field |
| month | `string` | yes | The month field |
| dayOfWeek | `string` | yes | The dayOfWeek field |
| year | `string` | yes | The year field. Quartz only |
| second | `string` | yes | The second field. Quartz only |

### cronix

Parse an expression into the corresponding ast. The output can be a subclass of `CronExpression` depending on the selected mode.
If parsing fails a `CronixParserException` is thrown.

```typescript
function cronix(expression: string|CronixExpression, mode: CronixMode): {value: CronExpression, errors: ParserException[]}
```

| Parameter | type | optional | description |
|-----------|------|----------|-------------|
| expression | `string or CronixExpression` | | The expression to parse |
| options | `CronixOptions` | Yes (defaults to Crontab mode) | The parser options |

| Return field | type | optional | description |
|-----------|------|----------|-------------|
| value | `CronExpression` | | The parsed expression. Null if the input cannot be parsed |
| errors | `array of ParserException` | | The errors encountered by the parser |

### CronixParser

Class holding a parsing context to reuse in repeated parsing. The base CronixParser class is abstract 
and should be subclassed to handle a specific dialect.

#### Available implementations

| Dialect | type | constructor|
|-----------|------|----------|
| crontab | `CronParser` | `new CronParser()` |
| quartz | `QuartzParser` | `new QuartzParser()` |
| jenkins | `JenkinsParser` | `new JenkinsParser()` |

#### parse

Parse a cron expression according to the parser's context. Returns an ast corresponding to the parsed expression. 
If parsing fails one or more `ParserException` will be added to the error list and the return value will be null.

```typescript
function parse(expression: string|CronixExpression): CronExpression
```

| Parameter | type | optional | description |
|-----------|------|----------|-------------|
| expression | `string or CronixExpression` | | The expression to parse |

#### errors

A getters that returns a list of errors encountered during. Useful for figuring out where the parsing fail.
It is reset with each call of parse method.

### ParserException

An exception indicating an error occured during a parse or parseField call. It wraps the caught expression with an indication of the step at which it failed.

| field | type | optional | description |
|-----------|------|----------|-------------|
| innerException | `Error or ILexingError` | | The root cause |
| options | `lexing or parsing or semantic` |  | The step at which parsing failed |

Other fields are inherited from the [Error interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) definition

## scripts

> build

Build into a ES5 package. Output can be found in the dist folder.

> test

Run Jest unit tests

> lint

run eslint on the sources.
