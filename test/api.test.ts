import { cron, ICronExpr, CronMode } from "../src/api";
import { QuartzCronExpression } from "src/syntax/quartz";

describe("compute", () => {
  test("A simple Crontab expression", () => {
    // Given
    // Everyday at 04:05
    const expression: ICronExpr = {
      minute: "5",
      hour: "4"
    };
    // When
    const parsed = cron(expression);
    // Then
    expect(parsed.minute.value()).toBe("5");
    expect(parsed.hour.value()).toBe("4");
    expect(parsed.dow.value()).toBe("*");
    expect(parsed.month.value()).toBe("*");
    expect(parsed.dom.value()).toBe("*");
  });

  test("String expression compute ok", () => {
    // Given
    // Everyday at 04:05
    const expression = "5 4 * * *";
    // When
    const parsed = cron(expression);
    // Then
    expect(parsed.minute.value()).toBe("5");
    expect(parsed.hour.value()).toBe("4");
    expect(parsed.dow.value()).toBe("*");
    expect(parsed.month.value()).toBe("*");
    expect(parsed.dom.value()).toBe("*");
  });

  test("Invalid string expression", () => {
    // Given
    // Everyday at 04:05
    const expression = "5 4 * ABC *";
    // When
    const parsed = cron(expression);
    // Then
    expect(parsed).toBeUndefined();
  });

  test("Jenkins expression", () => {
    // Given
    // Everyday at 04:05
    const expression = "5 4 * * H";
    // When
    const parsed = cron(expression, {
      mode: CronMode.JENKINS
    });
    // Then
    expect(parsed.minute.value()).toBe("5");
    expect(parsed.hour.value()).toBe("4");
    expect(parsed.dom.value()).toBe("*");
    expect(parsed.month.value()).toBe("*");
    expect(parsed.dow.value()).toBe("H");
  });

  test("Quartz expression", () => {
    // Given
    // Everyday at 04:05
    const expression = "0 5 4 * * ?";
    // When
    const parsed = cron(expression, {
      mode: CronMode.QUARTZ
    }) as QuartzCronExpression;
    // Then

    expect(parsed.second.value()).toBe("0");
    expect(parsed.minute.value()).toBe("5");
    expect(parsed.hour.value()).toBe("4");
    expect(parsed.dom.value()).toBe("*");
    expect(parsed.month.value()).toBe("*");
    expect(parsed.dow.value()).toBe("?");
  });
});
