import { QuartzCronExpression } from "@/syntax/quartz";
import { CronixExpression, CronixParser } from "@/cronix";
import CronixMode from "@/cronix/CronixMode";

describe("CronixParser Cron mode", () => {
  let parser: CronixParser;

  beforeEach(() => {
    parser = new CronixParser();
  });

  describe("parse", () => {

    test("Expression object should parse", () => {
      // Given
      // Everyday at 04:05
      const expression: CronixExpression = {
        minute: "5",
        hour: "4"
      };
      // When
      const parsed = parser.parse(expression);
      // Then
      expect(parsed.minute.value()).toBe("5");
      expect(parsed.hour.value()).toBe("4");
      expect(parsed.dow.value()).toBe("*");
      expect(parsed.month.value()).toBe("*");
      expect(parsed.dom.value()).toBe("*");
    });

    test("String expression should parse", () => {
      // Given
      // Everyday at 04:05
      const expression = "5 4 * * *";
      // When
      const parsed = parser.parse(expression);
      // Then
      expect(parsed.minute.value()).toBe("5");
      expect(parsed.hour.value()).toBe("4");
      expect(parsed.dow.value()).toBe("*");
      expect(parsed.month.value()).toBe("*");
      expect(parsed.dom.value()).toBe("*");
    });

    test("Invalid string expression should fail", () => {
      // Given
      // Everyday at 04:05
      const expression = "5 4 * ABC *";
      // When
      const parsed = parser.parse(expression);
      // Then
      expect(parsed).toBeUndefined();
    });

    test("Jenkins expression should fail", () => {
      // Given
      // Everyday at 04:05
      const expression = "5 4 * * H";
      // When
      const parsed = parser.parse(expression);
      // Then
      expect(parsed).toBeUndefined();
    });

    test("Quartz expression should parse with undefined field", () => {
      // Given
      // Everyday at 04:05
      const expression = "0 5 4 * * ?";
      // When
      const parsed: QuartzCronExpression = parser.parse(expression);
      // Then
      expect(parsed.second).toBeUndefined();
      expect(parsed.minute.value()).toBe("0");
      expect(parsed.hour.value()).toBe("5");
      expect(parsed.dom.value()).toBe("4");
      expect(parsed.month.value()).toBe("*");
      expect(parsed.dow.value()).toBe("*");
      expect(parsed.year).toBeUndefined()
    });
  });
  describe("parseField", () => {
    test("should parse a simple expression", () => {
      // Given
      const expression = "4-10/2";
      // When
      const parsed = parser.parseField(expression);
      // Then
      expect(parsed.value()).toBe(expression);
    });

    test("Quartz day of week should ignore Quartz specific tokens", () => {
      // Given
      const expression = "MON#4";
      // When
      const parsed = parser.parseField(expression);
      // Then
      expect(parsed.value()).toBe("MON");
    });
  });
});

describe("CronixParser Quartz mode", () => {
  let parser: CronixParser;

  beforeAll(() => {
    parser = new CronixParser({ mode: CronixMode.QUARTZ });
  });
  describe("parse", () => {
    test("expression object should", () => {
      // Given
      // Everyday at 04:05
      const expression: CronixExpression = {
        minute: "5",
        hour: "4"
      };
      // When
      const parsed = parser.parse(expression);
      // Then
      expect(parsed.minute.value()).toBe("5");
      expect(parsed.hour.value()).toBe("4");
      expect(parsed.dow.value()).toBe("*");
      expect(parsed.month.value()).toBe("*");
      expect(parsed.dom.value()).toBe("*");
    });

    test("String expression without seconds should fail", () => {
      // Given
      // Everyday at 04:05
      const expression = "5 4 * * *";
      // When
      const parsed = parser.parse(expression);
      // Then
      expect(parsed).toBeUndefined();
    });

    test("Invalid string expression should fail", () => {
      // Given
      // Everyday at 04:05
      const expression = "5 4 * ABC *";
      // When
      const parsed = parser.parse(expression);
      // Then
      expect(parsed).toBeUndefined();
    });

    test("Jenkins expression should fail", () => {
      // Given
      // Everyday at 04:05
      const expression = "5 4 * * H";
      // When
      const parsed = parser.parse(expression);
      // Then
      expect(parsed).toBeUndefined();
    });

    test("Quartz expression should parse", () => {
      // Given
      // Everyday at 04:05
      const expression = "0 5 4 * * ?";
      // When
      const parsed: QuartzCronExpression = parser.parse(expression);
      // Then
      expect(parsed.second.value()).toBe("0");
      expect(parsed.minute.value()).toBe("5");
      expect(parsed.hour.value()).toBe("4");
      expect(parsed.dom.value()).toBe("*");
      expect(parsed.month.value()).toBe("*");
      expect(parsed.dow.value()).toBe("?");
      expect(parsed.year.value()).toBe("*");
    });
  });
  describe("parseField", () => {
    test("should parse a simple expression", () => {
      // Given
      const expression = "4-10/2";
      // When
      const parsed = parser.parseField(expression);
      // Then
      expect(parsed.value()).toBe(expression);
    });

    test("Quartz day of week should parse", () => {
      // Given
      const expression = "MON#4";
      // When
      const parsed = parser.parseField(expression);
      // Then
      expect(parsed.value()).toBe("MON#4");
    });
  });
});

describe("CronixParser Jenkins mode", () => {
  let parser: CronixParser;

  beforeAll(() => {
    parser = new CronixParser({ mode: CronixMode.JENKINS });
  });
  describe("parse", () => {


    test("expression object should parse", () => {
      // Given
      // Everyday at 04:05
      const expression: CronixExpression = {
        minute: "5",
        hour: "4"
      };
      // When
      const parsed = parser.parse(expression);
      // Then
      expect(parsed.minute.value()).toBe("5");
      expect(parsed.hour.value()).toBe("4");
      expect(parsed.dow.value()).toBe("*");
      expect(parsed.month.value()).toBe("*");
      expect(parsed.dom.value()).toBe("*");
    });

    test("String expression should parse", () => {
      // Given
      // Everyday at 04:05
      const expression = "5 4 * * *";
      // When
      const parsed = parser.parse(expression);
      // Then
      expect(parsed.minute.value()).toBe("5");
      expect(parsed.hour.value()).toBe("4");
      expect(parsed.dow.value()).toBe("*");
      expect(parsed.month.value()).toBe("*");
      expect(parsed.dom.value()).toBe("*");
    });

    test("Invalid string expression should fail", () => {
      // Given
      // Everyday at 04:05
      const expression = "5 4 * ABC *";
      // When
      const parsed = parser.parse(expression);
      // Then
      expect(parsed).toBeUndefined();
    });

    test("Jenkins expression should parse", () => {
      // Given
      // Everyday at 04:05
      const expression = "5 4 * * H";
      // When
      const parsed = parser.parse(expression);
      // Then
      expect(parsed.minute.value()).toBe("5");
      expect(parsed.hour.value()).toBe("4");
      expect(parsed.dom.value()).toBe("*");
      expect(parsed.month.value()).toBe("*");
      expect(parsed.dow.value()).toBe("H");
    });

    test("Quartz expression should parse with undefined field", () => {
      // Given
      // Everyday at 04:05
      const expression = "0 5 4 * * ?";
      // When
      const parsed: QuartzCronExpression = parser.parse(expression);
      // Then
      expect(parsed.second).toBeUndefined();
      expect(parsed.minute.value()).toBe("0");
      expect(parsed.hour.value()).toBe("5");
      expect(parsed.dom.value()).toBe("4");
      expect(parsed.month.value()).toBe("*");
      expect(parsed.dow.value()).toBe("*");
      expect(parsed.year).toBeUndefined();
    });
  });
  describe("parseField", () => {
    test("should parse a simple expression", () => {
      // Given
      const expression = "4-10/2";
      // When
      const parsed = parser.parseField(expression);
      // Then
      expect(parsed.value()).toBe(expression);
    });

    test("Quartz day of week should ignore Quartz specific tokens", () => {
      // Given
      const expression = "MON#4";
      // When
      const parsed = parser.parseField(expression);
      // Then
      expect(parsed.value()).toBe("MON");
    });
  });
});
