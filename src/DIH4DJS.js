'use strict';

const { Client, ShardingManager } = require("discord.js");

/**
 * Base class for DIH4DJS
 */
class DIH4DJS {

    constructor(options) {
        
    }

    /**
     * Resolve 
     * @param {Client|ShardingManager} main
     * @returns {*}
     * @private
     */
    _resolveStrategy(main) {
        // Resolve main to ShardingStrategy
        if (main instanceof ShardingManager) {
            return null;
        }
        // Resolve main to ClientStrategy
        if (main instanceof Client) {
            return null;
        }

        throw new Error("DIH4DJS: Unknown Strategy");
    }
}

module.exports = DIH4DJS;