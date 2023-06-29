/*
 * Copyright 2023 OoP1nk
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const { mergeDefault, Collection} = require("discord.js");
const Options = require("../util/Options");

/**
 * Main class for all restricted commands.
 * @abstract
 * @since v3.0.0
 */
class RestrictedCommand {

    /**
     * Main constructor for a Restricted Command
     * @param {import('../util/Options').CommandOptions} options
     */
    constructor(options) {

        /**
         * Options a command has been created with.
         * @type {import("../util/Options").CommandOptions}
         */
        this.options = mergeDefault(Options.createDefault("command"), options);

        /**
         * @type {Collection<string, RestrictedCommand.Cooldown>}
         */
        this.COOLDOWN_CACHE = new Collection();
    }

    /**
     * Sets the cooldown for a command.
     * @param {Number} cooldown The number in milliseconds
     */
    setCooldown(cooldown) {
        this.options.cooldown = cooldown;
    }

    /**
     * Manually applys a cooldown for a specified user.
     * @param {string} userId The id of the user.
     * @param {Number} nextUse Timestamp at which the command can be used next.
     */
    applyCooldown(userId, nextUse) {
        this.COOLDOWN_CACHE.set(userId, new RestrictedCommand.Cooldown(Date.now(), nextUse))
    }

    /**
     * Get a users cooldown.
     * @param {string} userId The id of a user.
     * @returns {RestrictedCommand.Cooldown}
     */
    retrieveCooldown(userId) {
        const cooldown = this.COOLDOWN_CACHE.get(userId);
        if (!cooldown) return new RestrictedCommand.Cooldown(0, Date.now());
        return cooldown;
    }

    /**
     * Checks whether a user is currently on cooldown for this command.
     * @param {string} userId The id of the user.
     */
    hasCooldown(userId) {
        const cooldown = this.retrieveCooldown(userId);
        return cooldown.lastUse < cooldown.nextUse;
    }
}

module.exports = RestrictedCommand;

((RestrictedCommand) => {
    /**
     * Class representing a RestrictedCommand cooldown
     */
    class Cooldown {
        constructor(lastUse, nextUse) {

            /**
             * Timestamp at which the command was last used.
             * @type {Number}
             */
            this.lastUse = lastUse;

            /**
             * Timestamp of the next time a user can use the command.
             * @type {Number}
             */
            this.nextUse = nextUse;
        }
    }
    RestrictedCommand.Cooldown = Cooldown;
})(RestrictedCommand = module.exports ||
    (module.exports = {})
)