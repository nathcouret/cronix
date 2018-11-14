grammar cron;
// seconds minutes hours dayOfMonth month dayOfWeek year 
cronExpression:
	expression ' ' expression ' ' expression ' ' expression ' ' expression ' ' expression (
		' ' expression
	)?;

// Union is implicitly expressed through the repetition with ,
expression: exprNotUnion (',' exprNotUnion)*;

exprNotUnion: atomicExpr | interval | range;

interval: atomicExpr '/' atomicExpr;

range: atomicExpr '-' atomicExpr;

// leaves
atomicExpr: integer | month | dow;

month:
	'JAN'
	| 'FEB'
	| 'MAR'
	| 'APR'
	| 'MAY'
	| 'JUN'
	| 'JUL'
	| 'AUG'
	| 'SEP'
	| 'OCT'
	| 'NOV'
	| 'DEC';

// day of week with optional recurrence (quartz specific)
dow: dowUnion | integer ('#' integer | 'L');

dowUnion: 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

integer: INT (INT);

INT: '0' ..'9';