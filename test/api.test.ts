import { cronix } from "@/cronix";
import CronixMode from "@/cronix/CronixMode";

describe("cronix tests", () => {

  test("should parse simple quartz cron expression", () => {
    // Given

    // When
    const result = cronix("0 5 4 * * ?", { mode: CronixMode.QUARTZ });
    // Then
    expect(result.value.value()).toBe("0 5 4 * * ? *");
    expect(result.errors.length).toBe(0);
  });

  test("should fail to parse quartz cron expression in crontab mode", () => {
    // Given
    // When
    const result = cronix("0 5 4 * * ?");
    // Then
    expect(result.value).toBeNull();
    expect(result.errors.length).toBe(1);
  });

  test("should parse simple cron expression", () => {
    // Given
    // When
    const result = cronix("5 4 * * *");
    // Then
    expect(result.value.value()).toBe("5 4 * * *");
    expect(result.errors.length).toBe(0);
  });
});
