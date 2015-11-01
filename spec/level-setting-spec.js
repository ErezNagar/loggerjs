var Logger = require("../logger.js");

describe("Logger level tests:", function() {
	describe("Setting log level by name", function() {
		var logger = Logger.create();

		function setLevelTo(level){
			it("should set level to " + level, function() {
				logger.setLevel(level);
				var newLevel = logger.getLevel();
				expect(newLevel).toBe(level);
			});
		}

		setLevelTo("trace");
		setLevelTo("debug");
		setLevelTo("info");
		setLevelTo("warn");
		setLevelTo("error");
	});

	describe("setLevel() throws errors when given", function() {
		var logger = Logger.create();

		it("no level argument", function() {
			expect(function(){
				logger.setLevel();
			}).toThrow("Invalid level: undefined");
		});

		it("null level argument", function() {
			expect(function(){
				logger.setLevel(null);
			}).toThrow("Invalid level: null");
		});

		it("an undefined level argument", function() {
			expect(function(){
				logger.setLevel(undefined);
			}).toThrow("Invalid level: undefined");
		});

		it("an invalid level name argument", function() {
			expect(function(){
				logger.setLevel("InvalidLevelName");
			}).toThrow("Invalid level: InvalidLevelName");
		});

		it("an numeric level name argument", function() {
			expect(function(){
				logger.setLevel(2);
			}).toThrow("Invalid level: 2");
		});
	});

	describe("Log level settings", function() {
        var logger, appender, log;
		var mockAppender = function(){
			this.entries = [];
			this.write = function(msg){
				this.entries.push(msg);
			};
		};

        function setLoggerWithLevel(level){
            beforeEach(function() {
                logger = Logger.create();
                appender = new mockAppender();
                logger.setTestAppender(appender);
                logger.setLevel(level);
            });
        }

        describe("logger.trace()", function() {
            setLoggerWithLevel(Logger.levels.TRACE);

            it("is enabled at TRACE level", function() {
                logger.trace("A log message");
				expect(appender.entries.length).toBe(1);
            });

            it("is enabled at DEBUG level", function() {
                logger.debug("A log message");
				expect(appender.entries.length).toBe(1);
            });

            it("is enabled at INFO level", function() {
                logger.info("A log message");
				expect(appender.entries.length).toBe(1);
            });

            it("is enabled at WARN level", function() {
                logger.warn("A log message");
				expect(appender.entries.length).toBe(1);
            });

            it("is enabled at ERROR level", function() {
                logger.error("A log message");
				expect(appender.entries.length).toBe(1);
            });
        });

        describe("logger.debug()", function() {
            setLoggerWithLevel(Logger.levels.DEBUG);

            it("is disabled at TRACE level", function() {
                logger.trace("A log message");
				expect(appender.entries.length).toBe(0);
            });

            it("is enabled at DEBUG level", function() {
                logger.debug("A log message");
				expect(appender.entries.length).toBe(1);
            });

            it("is enabled at INFO level", function() {
                logger.info("A log message");
				expect(appender.entries.length).toBe(1);
            });

            it("is enabled at WARN level", function() {
                logger.warn("A log message");
				expect(appender.entries.length).toBe(1);
            });

            it("is enabled at ERROR level", function() {
                logger.error("A log message");
				expect(appender.entries.length).toBe(1);
            });
        });

        describe("logger.info()", function() {
            setLoggerWithLevel(Logger.levels.INFO);

            it("is disabled at TRACE level", function() {
                logger.trace("A log message");
				expect(appender.entries.length).toBe(0);
            });

            it("is disabled at DEBUG level", function() {
                logger.debug("A log message");
				expect(appender.entries.length).toBe(0);
            });

            it("is enabled at INFO level", function() {
                logger.info("A log message");
				expect(appender.entries.length).toBe(1);
            });

            it("is enabled at WARN level", function() {
                logger.warn("A log message");
				expect(appender.entries.length).toBe(1);
            });

            it("is enabled at ERROR level", function() {
                logger.error("A log message");
				expect(appender.entries.length).toBe(1);
            });
        });

        describe("logger.warn()", function() {
            setLoggerWithLevel(Logger.levels.WARN);

            it("is disabled at TRACE level", function() {
                logger.trace("A log message");
				expect(appender.entries.length).toBe(0);
            });

            it("is disabled at DEBUG level", function() {
                logger.debug("A log message");
				expect(appender.entries.length).toBe(0);
            });

            it("is disabled at INFO level", function() {
                logger.info("A log message");
				expect(appender.entries.length).toBe(0);
            });

            it("is enabled at WARN level", function() {
                logger.warn("A log message");
				expect(appender.entries.length).toBe(1);
            });

            it("is enabled at ERROR level", function() {
                logger.error("A log message");
				expect(appender.entries.length).toBe(1);
            });
        });

        describe("logger.error()", function() {
            setLoggerWithLevel(Logger.levels.ERROR);

            it("is disabled at TRACE level", function() {
                logger.trace("A log message");
				expect(appender.entries.length).toBe(0);
            });

            it("is disabled at DEBUG level", function() {
                logger.debug("A log message");
				expect(appender.entries.length).toBe(0);
            });

            it("is disabled at INFO level", function() {
                logger.info("A log message");
				expect(appender.entries.length).toBe(0);
            });

            it("is disabled at WARN level", function() {
                logger.warn("A log message");
				expect(appender.entries.length).toBe(0);
            });

            it("is enabled at ERROR level", function() {
                logger.error("A log message");
				expect(appender.entries.length).toBe(1);
            });
        });
    });
});