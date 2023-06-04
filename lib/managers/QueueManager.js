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

    paused = false;

    /** @type {Set<ApplicationCommand>} */
    items = new Set();

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
     * Fetches the bot user.
     */
    fetchBotUser() {
        return this.rest.get(Routes.user());
    }

    /**
     * Starts the queue manager.
     */
    start() {

    }

    pause() { this.paused = true; }

    /**
     * Fetches all existing commands for a given application.
     * @returns {Promise < Array < ApplicationCommand >>} The fetched list of commands.
     */
    async fetchCommands() {
        return await this.rest.get(Routes.applicationCommands(this.dih4djs.clientId));
    }

    /**
     *
     * @param {ApplicationCommand|Array<ApplicationCommand>} commands
     */
    async add(commands) {
        const bulk = Array.isArray(commands);
        const data = Array.of(commands);
        if(!bulk) {

        } else await this.rest.put(Routes.applicationCommands(this.dih4djs.clientId));
    }

    /**
     *
     */
    put() {

    }

    delete(command) {

    }

    patch(command) {

    }

    /**
     * @returns {Promise<unknown>|[]} List of existing commands (if error returns empty object)
     */
    fetchCommands() {
        (async () => {
            return await this.rest.get(Routes.applicationCommands(this.dih4djs))
        })().catch((err) => {
            console.error(err.message);
            this.pause();
            return [];
        });
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