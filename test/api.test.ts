import { cronix, CronixExpression } from "@/cronix";
import CronixMode from "@/cronix/CronixMode";

describe("cronix tests", () => {

  test("should parse simple quartz cron expression", () => {
    // Given

    // When
    const result = cronix("0 5 4 * * ?", CronixMode.QUARTZ);
    // Then
    expect(result.ast.value()).toBe("0 5 4 * * ? *");
    expect(result.errors.length).toBe(0);
  });

  test("should fail to parse quartz cron expression in crontab mode", () => {
    // Given
    // When
    const result = cronix("0 5 4 * * ?");
    // Then
    expect(result.ast).toBeNull();
    expect(result.errors.length).toBe(1);
  });

  test("should parse simple cron expression", () => {
    // Given
    // When
    const result = cronix("5 4 * * *");
    // Then
    expect(result.ast.value()).toBe("5 4 * * *");
    expect(result.errors.length).toBe(0);
  });

  test("should fail to parse a Jenkins expression in crontab mode", () => {
    // Given
    // When
    const result = cronix("H 4 * * *");
    // Then
    expect(result.ast).toBeNull();
    expect(result.errors.length).toBe(2);
  });

  test("should parse a Jenkins expression in Jenkins mode", () => {
    // Given
    // When
    const result = cronix("H 4 * * *", CronixMode.JENKINS);
    // Then
    expect(result.ast.value()).toBe("H 4 * * *");
    expect(result.errors.length).toBe(0);
  });

  test("test expression issue #32", () => {
    // Given
    const data: CronixExpression = {
      hour: 7,
      minute: '0',
      second: 0,
      dayOfMonth: '?',
      dayOfWeek: 'MON, WED, FRI'
    }

    // When
    const result = cronix(data, CronixMode.QUARTZ);

    // Then
    expect(result.ast.value()).toEqual("0 0 7 ? * MON,WED,FRI *");
  })
});
