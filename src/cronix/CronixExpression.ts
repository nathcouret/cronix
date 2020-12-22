/**
 * Type alias for a field in a {@link CronixExpression}.
 */
export type CronixField = string | number | string[] | number[] | (string | number)[];

/**
 * Expression input. Each field is optional and it's up to the parser to determine which field is used and what is their default value.
 * For instance the Quartz parser has a mandatory second field and an optional year one.
 *
 * Default values for the built-in parsers are *, except for the 'second' field of Quartz expression which has default value 0.
 */
export default interface CronixExpression {
  minute?: CronixField;
  hour?: CronixField;
  dayOfMonth?: CronixField;
  month?: CronixField;
  dayOfWeek?: CronixField;
  year?: CronixField;
  second?: CronixField;
}
