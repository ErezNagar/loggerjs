var Logger = require("../logger.js");

describe("Logger log date and time format tests:", function() {

    beforeEach(function(){
        function isDate(date){
            return !isNaN(Date.parse(date));
        }

        function isTime(time){
            var date = new Date().toJSON().slice(0,10);
            return !isNaN(Date.parse(date + " " + time));
        }

        this.addMatchers({
            toShowTimeOnly: function(){
                return isTime(this.actual.split(" ")[0]);
            },
            toShowDateOnly: function(){
                return isDate(this.actual.split(" ")[0]);
            },
            toShowDateAndTime: function(){
                var split = this.actual.split(" ");
                return isDate(split[0]) && isTime(split[1]);
            }
        });
    });

    var mockAppender = function(){
        this.output = "";
        this.write = function(msg){
            this.output = msg;
        };
    };

    var logger = Logger.create();
    var appender = new mockAppender();
    logger.setTestAppender(appender);

	it("Format is time only on default", function() {
        logger.error("A log message");
        expect(appender.output).toShowTimeOnly();
	});

    describe("showDateTime()", function() {
        it("removes date and time when no arguments are passed", function() {
            logger.showDateTime();
            logger.error("A log message");
            expect(appender.output).not.toShowDateAndTime();
        });

        it("removes date and time when invalid arguments are passed", function() {
            logger.showDateTime({
                showDate: "invalid",
                showTime: "invalid"
            });
            logger.error("A log message");
            expect(appender.output).not.toShowDateAndTime();
        });

        it("sets time when showTime is true", function() {
            logger.showDateTime({showTime: true});
            logger.error("A log message");
            expect(appender.output).toShowTimeOnly();
        });

        it("sets date when showDate is true", function() {
            logger.showDateTime({showDate: true});
            logger.error("A log message");
            expect(appender.output).toShowDateOnly();
        });

        it("sets time and date when both are true", function() {
            logger.showDateTime({
                showDate: true,
                showTime: true,
            });
            logger.error("A log message");
            expect(appender.output).toShowDateAndTime();
        });

        it("removes time and date when both are false", function() {
            logger.showDateTime({
                showDate: false,
                showTime: false,
            });
            logger.error("A log message");
            expect(appender.output).not.toShowDateAndTime();
        });
    });
});