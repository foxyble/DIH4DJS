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
    ApplicationCommand
} = require('discord.js');

/**
 * Queuing interface to publish commands to the Discord API
 * @since v3.0.0
 */
class QueueManager {

    /** @type {Set<ApplicationCommand>} */
    iqueue = new Set();

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
         * Existing commands for clients.
         * @type {*[]}
         */
        this.existingCommands = this.fetchExistingCommands();
    }

    /**
     *
     * @returns {*[]} The fetched list of commands.
     */
    fetchExistingCommands() {
        // const clients = this.dih4djs.clients;
        // const fetchedClients = [];
        // const fetchedCommands = [];
        // clients.forEach(async (client) => {
        //     if (fetchedClients.includes(client.id)) return;
        //     fetchedClients.push(client.id);
        //     fetchedCommands.push(
        //         ...(await client.rest.get(Routes.applicationCommands(client.application.id)))
        //     );
        // });
        // return fetchedCommands;
    }

    add(command) {
        this.iqueue.add(command);
    }

    delete(command) {

    }

    patch(command) {

    }

    /**
     * Removes duplicate commands from a given service (e.g. guild)
     * @param {} existing The existing commands to update/remove
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