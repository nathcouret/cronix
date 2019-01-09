interface CronExpr {
  second?: string;
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  year?: string;
}

enum CronMode {
  CRONTAB,
  QUARTZ,
  JENKINS
}

interface CronOptions {
  mode: CronMode;
}

export function cron(
  expression: string | CronExpr,
  options: CronOptions = { mode: CronMode.CRONTAB }
) {
  let expr;
  if (isCronException(expression)) {
    expr = expression;
  } else {
    expr = compute(expression, options);
  }
  return expr; /* smth */
}

function isCronException(
  expression: string | CronExpr
): expression is CronExpr {
  return (<CronExpr>expression).hour !== undefined;
}

function compute(expression: string, options: CronOptions): CronExpr {
  const splits = (expression as string).split(" ");
  const { mode } = options;
  switch (mode) {
    case CronMode.QUARTZ:
      const computed: CronExpr = {
        second: splits[0],
        minute: splits[1],
        hour: splits[2],
        dayOfMonth: splits[3],
        month: splits[4],
        dayOfWeek: splits[5]
      };
      if (splits.length >= 7) {
        computed.year = splits[6];
      }
      return computed;
    case CronMode.JENKINS:
    case CronMode.CRONTAB:
    default:
      return {
        minute: splits[0],
        hour: splits[1],
        dayOfMonth: splits[2],
        month: splits[3],
        dayOfWeek: splits[4]
      };
  }
}
