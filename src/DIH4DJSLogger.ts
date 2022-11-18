import chalk from 'chalk';

enum LoggerLevel {
    INFO = "INFO",
    ERROR = "ERROR",
    TRACE = "TRACE",
    DEBUG = "DEBUG",
    WARN = "WARN"
}

export default class DIH4DJSLogger {
    constructor() {}

    private static log = console.log;
    
    private static async log0(msg: any, level: LoggerLevel) {
        var format: string = `(%date%) [%level%]: ${msg}`
            .replace("%date%", chalk`{yellow ${new Date(Date.now()).toUTCString()}}`);
        switch(level) {
            case LoggerLevel.DEBUG:
                this.log(format.replace("%level%", chalk.blueBright(level)));
                break;
            case LoggerLevel.ERROR:
                this.log(format.replace("%level%", chalk.redBright(level)));
                break;
            case LoggerLevel.INFO:
                this.log(format.replace("%level%", chalk.cyan(level)));
                break;
            case LoggerLevel.TRACE:
                this.log(format.replace("%level%", chalk.blue(level)));
                break;
            case LoggerLevel.WARN:
                this.log(format.replace("%level%", chalk.red(level)));
                break;
        }
    }

    public static info(msg: any) {
        this.log0(msg, LoggerLevel.INFO);
    }

    public static warn(msg: any) {
        this.log0(msg, LoggerLevel.WARN);
    }

    public static error(msg: any) {
        this.log0(msg, LoggerLevel.ERROR);
    }

    public static debug(msg: any) {
        this.log0(msg, LoggerLevel.DEBUG);
    }

    public static trace(msg: any) {
        this.log0(msg, LoggerLevel.TRACE);
    }
}