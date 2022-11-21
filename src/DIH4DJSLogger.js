'use strict';

const chalk = require('chalk');

class DIH4DJSLogger {
    static blockedLogTypes = Array.of();

    /**
     * Main interface for logging different events.
     * @param {any} message 
     * @param {DIH4DJSLogger.Type} type 
     * @param {LoggerLevel} level 
     */
    static log(message, type, level) {
        if (this.blockedLogTypes.includes(type))
            return;
        var format = '(' + chalk`{yellow ${new Date(Date.now()).toUTCString()}}` + `) [%lvl]: ${message}`;
        return console.log(format.replace("%lvl", chalk(level)))
    }

    static info(msg, type) {
        this.log0(msg, (type ? type : DIH4DJSLogger.Type.Info), LoggerLevel.Info);
    }

    static warn(msg, type) {
        this.log0(msg, (type ? type : DIH4DJSLogger.Type.Warn), LoggerLevel.Warn);
    }

    static error(msg, type) {
        this.log0(msg, (type ? type : DIH4DJSLogger.Type.Error), LoggerLevel.Error);
    }

    static debug(msg, type) {
        this.log0(msg, (type ? type : DIH4DJSLogger.Type.Debug), LoggerLevel.Debug);
    }

    static trace(msg, type) {
        this.log0(msg, (type ? type : DIH4DJSLogger.Type.Trace), LoggerLevel.Trace);
    }
}

module.exports = DIH4DJSLogger;

(function (DIH4DJSLogger) {
    let Type;
    (function (Type) {
        Type[Type["Info"] = 0] = "Info";
        Type[Type["Error"] = 1] = "Error";
        Type[Type["Debug"] = 2] = "Debug";
        Type[Type["Warn"] = 3] = "Warn";
        Type[Type["Trace"] = 4] = "Trace";
        Type[Type["CommandQueued"] = 5] = "CommandQueued";
        Type[Type["SlashCommandRegistered"] = 6] = "SlashCommandRegistered";
        Type[Type["SlashCommandSkipped"] = 7] = "SlashCommandSkipped";
        Type[Type["SlashCommandNotFound"] = 8] = "SlashCommandNotFound";
        Type[Type["ContextCommandRegistered"] = 9] = "ContextCommandRegistered";
        Type[Type["ContextCommandSkipped"] = 10] = "ContextCommandSkipped";
        Type[Type["ContextCommandNotFound"] = 11] = "ContextCommandNotFound";
        Type[Type["SmartQueue"] = 12] = "SmartQueue";
        Type[Type["SmartQueueIgnored"] = 13] = "SmartQueueIgnored";
        Type[Type["SmartQueueDeleteUnknown"] = 14] = "SmartQueueDeleteUnknown";
        Type[Type["SmartQueueIgnoreUnknown"] = 15] = "SmartQueueIgnoreUnknown";
        Type[Type["ButtonNotFound"] = 16] = "ButtonNotFound";
        Type[Type["SelectMenuNotFound"] = 17] = "SelectMenuNotFound";
        Type[Type["ModalNotFound"] = 18] = "ModalNotFound";
    })(Type = DIH4DJSLogger.Type || (DIH4DJSLogger.Type = {}));
    let Level;
    (function (Level) {
        Level[Level["Info"] = chalk.cyan(`INFO`)] = "Info";
        Level[Level["Error"] = chalk.redBright(`ERROR`)] = "Info";
        Level[Level["Trace"] = chalk.blue(`TRACE}`)] = "Info";
        Level[Level["Debug"] = chalk.blueBright(`DEBUG`)] = "Info";
        Level[Level["Warn"] = chalk.red(`WARN`)] = "Info";
    })(Level = DIH4DJSLogger.Level || (DIH4DJSLogger.Level = {}));
})(DIH4DJSLogger = module.exports || (module.exports = {}));