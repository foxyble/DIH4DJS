"use strict";

const { Client } = require("discord.js");
const DIH4DJSLogger = require('./structures/interfaces/DIH4DJSLogger');

/**
 * DIH4DJS Options
 * @typedef {Object} DIHOptions
 * @property {DIH4DJSLogger|boolean} [useLogger] The logger to use, else doesnt log.
 * @property {boolean} [registerOnReady] Whether to auto-deploy commands on client ready.
 */

/**
 * Main interface
 * @since v1.3.0
 */
class DIH4DJS {
    /**@type {DIH4DJSLogger} */
    logger;

    /**
     * Main entry point for DIH4DJS.
     * @param {Client} client The discord.js client.
     * @param {DIHOptions} options
     */
    constructor(client, options) {
        this.options = this._validateOptions(options);
    }

    /**
     * Validates and returns useable options for instance.
     * @param {DIHOptions} options 
     * @private
     */
    _validateOptions(options) {
        if (options.useLogger instanceof ILogger) {
            this.logger = options.useLogger
        }
        return options;
    }
}

module.exports = DIH4DJS;