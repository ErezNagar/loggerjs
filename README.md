# Loggerjs
A simple logger for Node.js

## How to use
```javascript
var logger = require("./logger.js");
logger = logger.create();
...
logger.error("An error level log message");
```

## Features
* 5 logging methods:
	* `logger.error()`
	* `logger.warn()`
	* `logger.info()`
	* `logger.debug()`
	* `logger.trace()`
* Log level filter - filter logging nicely for production or for a crazy debugging session.
* Log category - mark logging with a category
* Log to default console and/or to a log file
* Show/hide date and time

## Options
### Category
Set logging with a category:
```javascript
logger = logger.create({ category: "MyCat" });
logger.error("A log message");
// output: ERROR MyCat A log message
```

### Log level
Set different logging level (Default is `logger.levels.ERROR`). Same as using setLevel().
```javascript
logger = logger.create({ level: "trace" });
// Or logger = logger.create({ level: logger.levels.TRACE });
```

### Log to a file
Set absolute file path to a log file, in addition to the default console:
```javascript
logger = logger.create({ file: "C:\logs\myLog.log" });
```
Or use only a log file:
```javascript
logger = logger.create({
	console: false,
	file: "C:\logs\myLog.log"
});
```

## API
Loggerjs outputs `[DATE] [TIME] [Category] LEVEL logMessage`

* `logger.levels.LEVEL`

All logger level constants:
`logger.levels.ERROR`, `logger.levels.WARN`, `logger.levels.INFO`, `logger.levels.DEBUG`, `logger.levels.TRACE`.

* `setLevel(level)` Default: `logger.levels.ERROR`
Disables all logging below the given level.

`level` - one of the logging levels.
```javascript
logger.setLevel(logger.levels.WARN);
logger.warn("WARN log messages would be shown");
logger.error("ERROR log messages would be shown");
logger.info("INFO log messages would be ignored");
```

* `showDateTime([options])`

`options` - An optional options object with the following attributes:
`showDate` - Boolean indicating whether to show current date in log or not.

`showTime` - Boolean indicating whether to show current time in log or not.

If no options are passed, `showDate` and `showTime` are set to false.

## License
Licensed under the MIT license.