import { CronixCron, CronixJenkins, CronixQuartz } from "@/cronix";
import exprDict from "../expression";

describe("CronixParser", () => {
  describe("parse", () => {
    const { expressions } = exprDict;
    test("Cron mode", () => {
      const parser = new CronixCron();
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
      const parser = new CronixQuartz();
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

    test("Jenkins mode", () => {
      const parser = new CronixJenkins();
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
      const parser = new CronixCron();
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
      const parser = new CronixQuartz();
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
      const parser = new CronixJenkins();
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
