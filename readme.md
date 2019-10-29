[![npm](https://img.shields.io/npm/v/cronix?style=flat-square)](https://npmjs.com/package/cronix)

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
You can specify options as a second argument to change that behaviour.

````javascript
import { cronix, CronMode } from "cronix";
// Every day at 00:00
// const expression = "0 0 * * *";
const expression = {
  minute: "0",
  hour: "0"
};

const parsedCron = cronix(expression);

// Get the computed expression using the value() method
// should be equal to expression
console.log(parsedCron.value());

expression.year = "*/2";

// Quartz supports a year field that is not available in standard cron
const parsedQuartz = cronix(expression, {mode: CronMode.QUARTZ});
console.log(parsedQuartz.value());
````

Alternatively you can use the class parser to manipulate expressions. 

````javascript
import { CronixParser } from "cronix";

// Every day at 00:00
const expression = "0 0 * * *";
const parser = new CronixParser();

const ast = parser.parse(expression);
// should be equal to expression
console.log(ast.value());

// You can use the parser to update a field in the expression
ast.minute = parser.parseElement("0,30");
// should be equal to 0,30
console.log(ast.minute.value());
````

## API

### CronixOptions

The options that can be passed to the parser.

| option | type | default | description |
|-----------|------|----------|-------------|
| mode | `CronMode` | `CRONTAB` | Possible values: CRONTAB, QUARTZ, JENKISN |

### CronixExpression

An object representing an input expression. Can be used when you only need to fill some fields and want to leave the rest to their default value `*`.

| field | type | optional | description |
|-----------|------|----------|-------------|
| minute | `string` | yes | The minute field |
| hour | `string` | yes | The hour field |
| dayOfMonth | `string` | yes | The dayOfMonth field |
| month | `string` | yes | The month field |
| dayOfWeek | `string` | yes | The dayOfWeek field |
| year | `string` | yes | The year field. Quartz only |
| second | `string` | yes | The second field. Jenkins only |

### cronix

Parse an expression into the corresponding ast. The output can be a subclass of `CronExpression` depending on the selected mode.

```typescript
function cronix(expression: string|CronixExpression, options: CronixOptions = {mode: CronixMode.CRONTAB}): CronExpression
```

| Parameter | type | optional | description |
|-----------|------|----------|-------------|
| expression | `string or CronixExpression` | | The expression to parse |
| options | `CronixOptions` | Yes (defaults to Crontab mode) | The parser options |

### CronixParser

Class holding a parsing context to reuse in repeated parsing. Can also be used to parse single field expression.

#### constructor

```typescript
constructor(options: CronixOptions = {mode: CronixMode.CRONTAB}): CronixParser
```

| Parameter | type | optional | description |
|-----------|------|----------|-------------|
| options | `CronixOptions` | Yes (defaults to Crontab mode) | The parser options |

#### parse

Parse a cron expression according to the parser's context. Returns an ast corresponding to the parsed expression.

```typescript
function parse(expression: string|CronixExpression): CronExpression
```

| Parameter | type | optional | description |
|-----------|------|----------|-------------|
| expression | `string or CronixExpression` | | The expression to parse |

#### parseField 

Parse a single field according to the parser's context. Returns an ast corresponding to the parsed field.

```typescript
function parseField(expression: string): CronExpression
```

| Parameter | type | optional | description |
|-----------|------|----------|-------------|
| expression | `string` | The expression to parse |



## scripts

> build

Build into a ES5 package. Output can be found in the dist folder.

> test

Run unit tests

> lint

run eslint on the sources.
