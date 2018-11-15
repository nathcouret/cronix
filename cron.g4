grammar cron;
// seconds minutes hours dayOfMonth month dayOfWeek year 
cronExpression:
	expression ' ' expression ' ' expression ' ' expression ' ' expression ' ' expression (
		' ' expression
	)?;

// Union is implicitly expressed through the repetition with ,
expression: exprNotUnion (',' exprNotUnion)*;

exprNotUnion: atomicExpr | (interval | range | dow);

interval: '/' atomicExpr;

range: '-' atomicExpr;

dow: 'L' | ('#') INTEGER;

// leaves
atomicExpr: INTEGER | MONTH | DOW | '*' | '?';

MONTH:
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

DOW: 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

INTEGER: INT (INT);

INT: '0' ..'9';