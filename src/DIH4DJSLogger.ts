/**
 * DIH4DJS is a power package to handle interactions using 
 * the discord.js library.
 * Copyright (C) 2022  OoP1nk
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */
import chalk from 'chalk';

enum LoggerLevel {
    INFO = "INFO",
    ERROR = "ERROR",
    TRACE = "TRACE",
    DEBUG = "DEBUG",
    WARN = "WARN"
}

export class DIH4DJSLogger {
    constructor() {}

    private static log = console.log;
    public static blockedLogTypes: DIH4DJSLogger.Type[] = Array.of();
    
    private static async log0(msg: any, type: DIH4DJSLogger.Type, level: LoggerLevel) {
        if(this.blockedLogTypes.includes(type)) return;
        var format: string = `(%date) [%lvl]: ${msg}`.replace("%date", chalk`{yellow ${new Date(Date.now()).toUTCString()}}`);
        switch(level) {
            case LoggerLevel.DEBUG:
                this.log(format.replace("%lvl", chalk.blueBright(level)));
                break;
            case LoggerLevel.ERROR:
                this.log(format.replace("%lvl", chalk.redBright(level)));
                break;
            case LoggerLevel.INFO:
                this.log(format.replace("%lvl", chalk.cyan(level)));
                break;
            case LoggerLevel.TRACE:
                this.log(format.replace("%lvl", chalk.blue(level)));
                break;
            case LoggerLevel.WARN:
                this.log(format.replace("%lvl", chalk.red(level)));
                break;
        }
    }

    static info(msg: string, type?: DIH4DJSLogger.Type) {
        this.log0(msg, (type ? type : DIH4DJSLogger.Type.Info), LoggerLevel.INFO);
    }

    static warn(msg: string, type?: DIH4DJSLogger.Type) {
        this.log0(msg, (type ? type : DIH4DJSLogger.Type.Warn), LoggerLevel.WARN);
    }

    static error(msg: string, type?: DIH4DJSLogger.Type) {
        this.log0(msg, (type ? type : DIH4DJSLogger.Type.Error), LoggerLevel.ERROR);
    }

    static debug(msg: string, type?: DIH4DJSLogger.Type) {
        this.log0(msg, (type ? type : DIH4DJSLogger.Type.Debug), LoggerLevel.DEBUG);
    }

    static trace(msg: string, type?: DIH4DJSLogger.Type): any {
        this.log0(msg, (type ? type : DIH4DJSLogger.Type.Trace), LoggerLevel.TRACE);
    }
}

export namespace DIH4DJSLogger {
    export enum Type {
        Info,
        Error,
        Debug,
        Warn,
        Trace,
        CommandQueued,
        SlashCommandRegistered,
        SlashCommandSkipped,
        SlashCommandNotFound,
        ContextCommandRegistered,
        ContextCommandSkipped,
        ContextCommandNotFound,
        SmartQueue,
        SmartQueueIgnored,
        SmartQueueDeleteUnknown,
        SmartQueueIgnoreUnknown,
        ButtonNotFound,
        SelectMenuNotFound,
        ModalNotFound
    }
}