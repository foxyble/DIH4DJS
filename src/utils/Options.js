'use strict';

const DIH4DJS = require('../DIH4DJS');
const DIH4DJSLogger = require('../DIH4DJSLogger');
const RegistrationType = require('./RegistrationType');

/**
 * Options for DIH4DJS
 * @typedef {Object} DIHOptions
 * @property {string|string[]} [packages] The packages where commands & 
 * interaction handlers will be held.
 * @property {string} [defaultRegistrationType] The default registration type
 * to fall back to if not specified for a command.
 * @property {string} [testingServer] The testing/support guild for the bot.
 * @property {LoggerOptions} [logging={}] Different options for the logger e.g. whether it should be disabled
 * or block certain logger types.
 * @property {boolean} [registerOnReady] Whether the package should register all commands when the client is ready.
 */

/**
 * @typedef {Object} LoggerOptions
 * @property {boolean} [enabled] Whether the custom logger should be enabled (Defaults to enabled = true).
 * @property {DIH4DJSLogger.Type[]} [blockedTypes]
 */

class Options extends null {
    /**
     * @param {DIHOptions} options 
     */
    static validateOptions(options) {
        if (options === null || options === undefined)
            return this.createDefault();

        const validOptions = { ...this.createDefault(), ...options };
        if (validOptions.logging && validOptions.logging.blockedTypes > 0)
            DIH4DJSLogger.blockedLogTypes.push(...validOptions.logging.blockedTypes);
        if (validOptions.defaultRegistrationType)
            DIH4DJS.defaultRegistrationType = validOptions.defaultRegistrationType;
        return validOptions;
    }
    /**
     * Default DIH4DJS Options
     * @returns {DIHOptions}
     */
    static createDefault() {
        return {
            packages: ["./commands/", "./components/"],
            defaultRegistrationType: RegistrationType.Global,
            registerOnReady: true,
            logging: {
                enabled: true,
                blockedTypes: []
            }
        }
    }
}

module.exports = Options;