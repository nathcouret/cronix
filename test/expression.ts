import { CronixExpression } from "@/cronix";

export interface ExpressionDictionary {
  expressions: {
    [key: string]: string | CronixExpression;
  }
  fields: {
    [key: string]: string;
  }
}

const dictionary: ExpressionDictionary = {
  expressions: {
    partialObject: {
      minute: "5",
      hour: "4"
    } as CronixExpression,
    fullObject: {
      second: "0",
      minute: "0",
      hour: "12",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "1-5",
      year: "*"
    } as Required<CronixExpression>,
    quartzObjectWithSteps: {
      second: "12",
      minute: "5",
      hour: "4",
      dayOfWeek: "?",
      dayOfMonth: "*/3",
      month: "*/2",
      year: "*/2"
    } as CronixExpression,
    simpleString: "5 4 * * *",
    simpleStringQuartz: "0 5 4 * * ?",
    simpleStringJenkins: "H H * * *",
    invalidTokens: "5 4 * ABC *",
    stringQuartzWithoutAnyDayOfWeek: "0 5 4 * * *"
  },
  fields: {
    withRangeAndStep: "4-10/2",
    dayOfWeekWithQuartzOccurrence: "MON#4",
    everyExpr: "*",
    anyExpr: "?",
    singleNumber: "5",
    singleDay: "MON",
    dayRange: "TUE-SUN",
    numberRange: "2-20",
    numberStep: "10/2"
  }

};

export default dictionary;





