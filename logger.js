/*
* Loggerjs
*
* Copyright (c) 2015 Erez Nagar (erez.nagar@gmail.com)
* Licensed under the MIT license.
*/

(function (root, logger) {
    if (typeof module === "object" && module.exports) {
        module.exports = logger();
    }
    /* 
    * Currently not in use
    * 
    * else if (typeof define === "function" && typeof define.amd === "object") {
    *    define(logger);
    * } else {
    *     root.Logger = logger();
    * }
    */
}(this, function () {
	"use strict";

	// Constants
	// ----------
	var LEVELS = ["trace", "debug", "info", "warn", "error"],
		DEFAULT_LEVEL = "error";

	/**
	* ConsoleAppender object
	*
	* write logs to console
	*/
	var ConsoleAppender = function(){
		var writer = console.log;

		this.write = function(msg){
			writer(msg);
		};
	};

	/**
	* FileAppender object
	*
	* write logs to a file
	* @param {string}  [file] The file to write to.
	*/
	var FileAppender = function(file){
		var fs = require("fs");
		var writer = fs.createWriteStream(file, {flags: "a"});

		writer.on("error", function(err){
			console.log("error writing to file.\n" + err);
			this.close();
		});

		this.write = function(msg){
			writer.write(msg + "\n");
		};

		this.close = function() {
	        if (writer)
	            writer.end("\n");
	    };
	};

	/**
	* Logger object
	*
	* @param {Options} [options] 		   Options.
	* @param {string}  [options.category]  Optional, Logger category.
	* @param {srting}  [options.level] 	   Optional, Logger level.
	* @param {boolean} [options.console]   Optional, Whether to log to console or not
	* @param {string}  [options.file]      Optional, File to log to
	*/
	var Logger = function(options){
		var self = this;
		var category, levels, level, appenders, format;

		var init = function(options){
			//Validate options		
			options = options || {};
			category = options.category || "";
			levels = LEVELS;
			level = options.level || DEFAULT_LEVEL;

			//Appender options
			appenders = [];
			var file = options.file || false,
				consoleAppender = (!options.console && !file)? true : options.console || false;

			//Default format options
			format = {
				showDate: false,
				showTime: true,
			};

			try{
				self.setLevel(level);
			}catch(e){
				level = DEFAULT_LEVEL;
			}

			if (consoleAppender)
				appenders.push(new ConsoleAppender());
			if (file)
				appenders.push(new FileAppender(file));

			setMethods(level);
		};

		var log = function(msg, level){
			var entry = createLogEntry(msg, level);

			// process.nextTick(function() {
				appenders.forEach(function(appender){
					appender.write(entryFormatter(entry));
				});
			// });
		};

		var setMethods = function(level){
			levels.forEach(function(lvl) {
				self[lvl] = function(){		//Empty function on falsy condition
	                if (levels.indexOf(lvl) >= levels.indexOf(level)) {
	                    var args = Array.prototype.slice.call(arguments);
	                    log(args, lvl);
	                }
	            };
			});

			// for (var i = 0; i < levels.length; i++) {
			// 	var method = levels[i];
			// 	self[method] = function(){
			// 			if (i >= levels.indexOf(level)){
			// 			var args = Array.prototype.slice.call(arguments);
			// 			log(args, method);
			// 		};
			// 	};
			// }
		};

		/**
		* Create an entry object used to log messages
		*
		* @param {string} [msg]	  		The message to log
		* @param {string} [entryLevel]	The level of the entry
		* @returns the entry object
		*/
		var createLogEntry = function(msg, entryLevel){
			var entry = {
				timestamp: Date.now(),
				level: entryLevel,
				category: category,
				message: msg
			}
			return entry;
		};

		/**
		* Format a log entry
		*
		* @param {Object} [entry] The entry object
		* @returns {string} The entry object as a formatted message
		*/
		var entryFormatter = function(entry){
			var dateTime = new Date(entry.timestamp),
				formatted = "";

			var padding = function(num){
				return num < 10 ? "0" + num : num;
			}
			if (format.showDate){
				var mon = dateTime.getMonth() + 1;
				var day = dateTime.getDate();
				var yr = dateTime.getFullYear();
				formatted = padding(mon) + "/" + padding(day) + "/" + padding(yr) + " ";
			}

			if (format.showTime){
				var hrs = dateTime.getHours();
				var mins = dateTime.getMinutes();
				var secs = dateTime.getSeconds();
				formatted += padding(hrs) + ":" + padding(mins) + ":" + padding(secs) + " ";
			}

			formatted += entry.level.toUpperCase() + " ";
			if (entry.category)
				formatted += entry.category + " ";
			formatted += entry.message;

			return formatted;
		};

		// Public API
		// ----------

		this.setLevel = function(newLevel){
			if (typeof newLevel !== "string" || levels.indexOf(newLevel.toLowerCase()) === -1)
				throw new Error("Invalid level: " + newLevel);

			level = newLevel.toLowerCase();
			setMethods(level);
		};

		/**
		* A method to set log date and time
		*
		* @param {Options} [options] 		   Options.
		* @param {string}  [options.showDate]  Optional, adds date to log message.
		* @param {srting}  [options.showTime]  Optional, adds time to log message.
		*/
		this.showDateTime = function(options){
			options = options || {};
			format.showDate = typeof options.showDate === "boolean"? options.showDate : false;
			format.showTime = typeof options.showTime === "boolean"? options.showTime : false;
		};

		// Used for testing
		this.getLevel = function(){
			return level;
		};

		// Used for testing
		this.setTestAppender = function(appender){
			appenders.push(appender);
		};

		init(options);
	};

	// Package-level API
	// ----------

	var logger = {};
	logger.levels = {"TRACE": LEVELS[0], "DEBUG": LEVELS[1], "INFO": LEVELS[2], "WARN": LEVELS[3], "ERROR": LEVELS[4]};
	logger.create = function(options){
		return new Logger(options);
	}
	
	return logger;
}));