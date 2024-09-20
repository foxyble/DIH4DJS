/**
 *  Copyright 2024 Foxyble Interactive
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';

const { Client, BaseInteraction } = require('discord.js');

/**
 * Represents and application command.
 * @abstract
 */
class BaseApplicationCommand {

    /**
     * Used to instantiate a new ApplicationCommand instance.
     *
     * TODO: Add BaseApplicationCommandOptions
     * @param {T} builder
     * @param {{}} options
     */
    constructor(builder, options) {
        this.builder = builder;
        this.options = options;
    }

    /**
     * Runs when the command gets executed.
     *
     * @param {Client} client
     * @param {BaseInteraction} interaction
     * @abstract
     */
    onExecute(client, interaction) {}
}

module.exports = BaseApplicationCommand;