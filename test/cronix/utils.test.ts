import { expressionToString, fieldToString } from "@/cronix/utils";
import { CronixField } from "@/cronix/CronixExpression";
import { CronixExpression } from "@/cronix";
import CronixMode from "@/cronix/CronixMode";

describe("Cronix utils", () => {

  describe("fieldToString", () => {
    test.each([
      [undefined, "*"],
      [null, "*"],
      [0, "0"],
      ["1", "1"],
      [["0", "1", "2"], "0,1,2"]
    ])("%s => %s", (data: CronixField, expected: string) => {
      const result = fieldToString(data);
      expect(result).toEqual(expected);
    });
  });

  describe("expressionToString", () => {
    test.each([
      [{}, "* * * * *"],
      [{ minute: "12" }, "12 * * * *"],
      [{ minute: "12/2" }, "12/2 * * * *"],
      [{ hour: ["10", "11", "12"] }, "* 10,11,12 * * *"],
      [{ hour: ["8-10", "11", "12"] }, "* 8-10,11,12 * * *"],
      [{ hour: ["8-10", 11, 12] }, "* 8-10,11,12 * * *"],
      [{ hour: ["10", 11, 12] }, "* 10,11,12 * * *"],
      [{ hour: 10 }, "* 10 * * *"],
      [{ dayOfWeek: "MON" }, "* * * * MON"],
      ["12/2 * * * *", "12/2 * * * *"]
    ])("[crontab] %p => %s", (data: CronixExpression | string, expected: string) => {
      const result = expressionToString(data, { mode: CronixMode.CRONTAB });
      expect(result).toEqual(expected);
    });

    test.each([
      [{}, "* * * * * *"],
      [{ minute: "12" }, "* 12 * * * *"],
      [{ minute: "12/2" }, "* 12/2 * * * *"],
      [{ hour: ["10", "11", "12"] }, "* * 10,11,12 * * *"],
      [{ hour: ["8-10", "11", "12"] }, "* * 8-10,11,12 * * *"],
      [{ hour: ["8-10", 11, 12] }, "* * 8-10,11,12 * * *"],
      [{ hour: ["10", 11, 12] }, "* * 10,11,12 * * *"],
      [{ hour: 10 }, "* * 10 * * *"],
      [{ dayOfWeek: "MON" }, "* * * * * MON"],
      [{ second: "26" }, "26 * * * * *"],
      [{ second: 0 }, "0 * * * * *"],
      [{ second: null }, "* * * * * *"],
      [{ year: "2020" }, "* * * * * * 2020"],
      [{ year: null }, "* * * * * *"],
    ])("[Quartz] %p => %s", (data: CronixExpression | string, expected: string) => {
      const result = expressionToString(data, { mode: CronixMode.QUARTZ });
      expect(result).toEqual(expected);
    });
  });
});