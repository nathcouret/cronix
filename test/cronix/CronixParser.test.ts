import { CronixParser } from "@/cronix";
import CronixMode from "@/cronix/CronixMode";
import exprDict from "../expression";

describe("CronixParser", () => {
  describe("parse", () => {
    const { expressions } = exprDict;
    test("Cron mode", () => {
      const parser = new CronixParser();
      const testResults = Object.values(expressions).map(expr => {
        const result = parser.parse(expr);
        return {
          input: expr,
          result,
          errors: parser.errors
        };
      });
      expect(testResults).toMatchSnapshot();
    });

    test("Quartz mode", () => {
      const parser = new CronixParser({ mode: CronixMode.QUARTZ });
      const testResults = Object.values(expressions).map(expr => {
        const result = parser.parse(expr);
        return {
          input: expr,
          result,
          errors: parser.errors
        };
      });
      expect(testResults).toMatchSnapshot();
    });

    test("Quartz mode", () => {
      const parser = new CronixParser({ mode: CronixMode.JENKINS });
      const testResults = Object.values(expressions).map(expr => {
        const result = parser.parse(expr);
        return {
          input: expr,
          result,
          errors: parser.errors
        };
      });
      expect(testResults).toMatchSnapshot();
    });
  });

  describe("parseField", () => {
    const { fields } = exprDict;

    test("Cron mode", () => {
      const parser = new CronixParser();
      const testResults = Object.values(fields).map(expr => {
        const result = parser.parseField(expr);
        return {
          input: expr,
          result,
          errors: parser.errors
        };
      });
      expect(testResults).toMatchSnapshot();
    });

    test("Quartz mode", () => {
      const parser = new CronixParser({ mode: CronixMode.QUARTZ });
      const testResults = Object.values(fields).map(expr => {
        const result = parser.parseField(expr);
        return {
          input: expr,
          result,
          errors: parser.errors
        };
      });
      expect(testResults).toMatchSnapshot();
    });

    test("Quartz mode", () => {
      const parser = new CronixParser({ mode: CronixMode.JENKINS });
      const testResults = Object.values(fields).map(expr => {
        const result = parser.parseField(expr);
        return {
          input: expr,
          result,
          errors: parser.errors
        };
      });
      expect(testResults).toMatchSnapshot();
    });
  });
});
