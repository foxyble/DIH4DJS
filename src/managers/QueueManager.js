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

const DIH4DJS = require('../DIH4DJS');
const ContextCommand = require('../structures/ContextCommand');
const SlashCommand = require('../structures/SlashCommand');
const Pair = require("../util/Pair");
const {
    Routes,
    Guild,
    ApplicationCommand,
    REST
} = require('discord.js');

/**
 * Queuing interface to publish commands to the Discord API
 * @since v3.0.0
 */
class QueueManager {

    /**
     * Constructs a new QueueManager interface.
     * @param {DIH4DJS} dih4djs The pair of commands to publish.
     */
    constructor(dih4djs) {

        /**
         * The current {@link DIH4DJS} instance.
         * @type {DIH4DJS}
         */
        this.dih4djs = dih4djs;

        /**
         * Creates a rest instance based on token in 
         * the used strategy.
         * @type {REST}
         */
        this.rest = new REST({ version: '10' }).setToken(dih4djs.options.strategy.token);
    }

    /**
     * Upsert commands to discord API.
     * @param {SlashCommand[]} slashcommands 
     * @param {ContextCommand[]} contextcommands 
     * @param {Guild} guild 
     */
    async upsert(slashcommands, contextcommands, guild = null) {
        const global = (guild === null);
        const route = (global ? Routes.applicationCommands(this.dih4djs.clientId) : Routes.applicationGuildCommands(this.dih4djs.clientId, guild.id));
        return await this.rest.put(route, 
            { body: [...slashcommands.map(c => c.data.toJSON()).concat(...contextcommands.map(c => c.data.toJSON()))] }
        );
    }

    /**
     * Fetches the bot user.
     */
    async fetchBotUser() {
        return await this.rest.get(Routes.user());
    }

    /**
     * @returns {Promise<unknown>} List of existing commands (if error returns empty object)
     */
    async fetchCommands() {
        return await this.rest.get(Routes.applicationCommands(this.dih4djs.clientId));
    }

    /**
     * Removes duplicate commands from a given service (e.g. guild)
     * @param {ApplicationCommand} existing The existing commands to update/remove
     * @param {Guild} [guild] The guild to update the commands on (leave blank if updating globally).
     * @returns {Pair<SlashCommand[], ContextCommand[]>} The updated commands.
     * @private
     */
    removeDuplicates(existing, guild = null) {
        const global = !guild;
        throw new Error("Method has not been implemented yet!");
    }
}

module.exports = QueueManager;