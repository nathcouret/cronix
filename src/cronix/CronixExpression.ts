/**
 * Expression input. Each field is optional and it's up to the parser to determine which field is used and what is their default value.
 * For instance the Quartz parser has a mandatory second field and an optional year one.
 */
export default interface CronixExpression {
  minute?: string;
  hour?: string;
  dayOfMonth?: string;
  month?: string;
  dayOfWeek?: string;
  year?: string;
  second?: string;
}
