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

const SlashCommand = require('../structures/SlashCommand');
const ContextCommand = require('../structures/ContextCommand');
const {
    Collection
} = require("discord.js");

class InteractionManager {
    slashcommands;
    contextcommands;
    slashcommandIndex;
    messageContextIndex;
    userContextIndex;

    dih4djs;

    /**
     * Constructs a new manager to handler interactions.
     * @param {DIH4DJS} dih4djs The {@link DIH4DJS} instance.
     */
    constructor(dih4djs) {

        /**
         * The current DIH4DJS instance.
         * @type {DIH4DJS}
         */
        this.dih4djs = dih4djs;

        /** @type {SlashCommand[]} */
        this.slashcommands = Array.of();

        /** @type {ContextCommand[]} */
        this.contextcommands = Array.of();

        /**
         * Collection {@link SlashCommand} by name.
         * @type {Collection<string, SlashCommand>}
         * */
        this.slashcommandIndex = new Collection();

        /**
         * Collection of {@link ContextCommand.Message} by name.
         * @type {Collection<string, ContextCommand.Message>}
         * */
        this.messageContextIndex = new Collection();

        /**
         * Collection of {@link ContextCommand.User} by name.
         * @type {Collection<string, ContextCommand.User>}
         * */
        this.userContextIndex = new Collection();
    }

    /**
     * Registers the list of commands using {@link SmartQueue}
     */
    registerInteraction() {
        //TODO: Register interactions
    }

    /**
     *
     * @param {string[]} packages
     */
    findCommandsAndComponents(packages) {

    }
}

module.exports = InteractionManager;