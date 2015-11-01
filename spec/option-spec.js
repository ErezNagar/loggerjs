var Logger = require("../logger.js");

describe("Logger option tests:", function() {

    var mockAppender = function(){
        this.output = "";
        this.write = function(msg){
            this.output = msg;
        };
    };
    var appender = new mockAppender();

	describe("Category option", function() {
		it("is not set", function() {
            var logger = Logger.create();
            logger.setTestAppender(appender);
            logger.error("A log message");

			expect(appender.output).not.toContain("Testing");
		});

        it("is set to Testing", function() {
            var logger = Logger.create({category: "Testing"});
            logger.setTestAppender(appender);
            logger.error("A log message");

            expect(appender.output).toContain("Testing");
        });
	});

    describe("Level option", function() {
        it("is default when level is not specified", function() {
            var logger = Logger.create();
            logger.setTestAppender(appender);
            logger.error("A log message");
            expect(appender.output).toContain("ERROR");
        });

        it("is default when given an invalid value", function() {
            var logger = Logger.create({level: "invalid"});
            logger.setTestAppender(appender);
            logger.error("A log message");
            expect(appender.output).toContain("ERROR");
        });

        it("is default when given a numeric value", function() {
            var logger = Logger.create({level: 1});
            logger.setTestAppender(appender);
            logger.error("A log message");
            expect(appender.output).toContain("ERROR");
        });

        it("is LEVEL when given level literal", function() {
            var logger = Logger.create({level: "trace"});
            logger.setTestAppender(appender);
            logger.trace("A log message");
            expect(appender.output).toContain("TRACE");
        });

        it("is LEVEL when given LEVEL", function() {
            var logger = Logger.create({level: "TRACE"});
            logger.setTestAppender(appender);
            logger.trace("A log message");
            expect(appender.output).toContain("TRACE");
        });

        it("is LEVEL when given levels.LEVEL constant", function() {
            var logger = Logger.create({level: Logger.levels.TRACE});
            logger.setTestAppender(appender);
            logger.trace("A log message");
            expect(appender.output).toContain("TRACE");
        });
    });
});