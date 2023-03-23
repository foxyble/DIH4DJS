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

/**
 * Options for all restricted commands.
 * @typedef {Object} CommandOptions
 * @property {Number} [cooldown] Whether the command has a cooldown.
 * @property {bigint[]} [permissions] Permissions to apply when registering command.
 */

/**
 * Main class for all restricted commands.
 * @abstract
 * @since v1.3.0
 */
class RestrictedCommand {

    /**
     *
     * @param {CommandOptions} options
     */
    constructor(options) {
        this.options = this._validateOptions(options);
    }

    /**
     * Validates the given {@link CommandOptions}.
     * @param {CommandOptions} options The options to validate.
     * @returns {CommandOptions} Validated command options.
     * @private
     */
    _validateOptions(options) {
        // TODO: Validate command options
        return options;
    }
}

module.exports = RestrictedCommand;