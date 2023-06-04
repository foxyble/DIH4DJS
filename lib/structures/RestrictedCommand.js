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

const { mergeDefault } = require("discord.js");
const Options = require("../util/Options");

/**
 * Main class for all restricted commands.
 * @abstract
 * @since v3.0.0
 */
class RestrictedCommand {

    constructor(options) {

        /**
         * Options a command has been created with.
         * @type {import("../util/Options").CommandOptions}
         */
        this.options = mergeDefault(Options.createDefault("command"), options);

        this._validateOptions();
    }

    /**
     * Validates the given {@link CommandOptions}.
     * @param {CommandOptions} options The options to validate.
     * @returns {CommandOptions} Validated command options.
     * @private
     */
    _validateOptions() {
        // TODO: Validate command options
    }
}

module.exports = RestrictedCommand;