'use strict';

const { ModifierFlags } = require('typescript');
const { DIH4DJSLogger } = require('../DIH4DJSLogger');
const RegistrationType = require('./RegistrationType');

/**
 * Options for DIH4DJS
 * @typedef {Object} DIHOptions
 * @property {string|string[]} [packages] The packages where commands & 
 * interaction handlers will be held.
 * @property {RegistrationType.RegistrationType} [defaultRegistrationType] The default registration type
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