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

// Imports
const RestrictedCommand = require("./RestrictedCommand");

/**
 * Main interface for discord.js ApplicationCommands.
 * @abstract
 * @implements {ExecutableCommand}
 * @since v3.0.0
 */
class BaseApplicationCommand extends RestrictedCommand {
    data;

    /**
     * @param {T} data
     * @param {CommandOptions} options
     * @public
     */
    constructor(data, options) {
        super(options);
        this.data = data;
    }

    /**
     * Updates the existing command data.
     * @param {T} newData
     * @public
     */
    setCommandData(newData) { this.data = newData; }

    /**
     * Get the command type e.g. SlashCommand
     * @returns {Number} The type of this command.
     */
    get type() { return this.data.type; };

    execute(client, interaction) { };
}

module.exports = BaseApplicationCommand;