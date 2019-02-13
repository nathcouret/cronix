import { cron, ICronExpr } from "../src/api";

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
});
