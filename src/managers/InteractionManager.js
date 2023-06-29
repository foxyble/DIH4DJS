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
const SlashCommand = require('../structures/SlashCommand');
const ContextCommand = require('../structures/ContextCommand');
const {
    Collection, ApplicationCommandType
} = require("discord.js");
const ClassWalker = require('../util/ClassWalker');
const RestrictedCommand = require('../structures/RestrictedCommand');
const Pair = require('../util/Pair');

class InteractionManager {

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

        /** @type {Collection<string, SlashCommand>} */
        this.slashcommands = new Collection();

        /** @type {Collection<string, ContextCommand>} */
        this.contextcommands = new Collection();

        /**
         * Collection commands by id.
         * @type {Collection<string, any>}
         */
        this.commandIndex = new Collection();
    }

    /**
     * Registers the list of commands using {@link SmartQueue}
     */
    registerInteraction() {
        const commands = new Pair(this.slashcommands, this.contextcommands);

    }

    /**
     *
     * @param {string[]} packages
     */
    async findCommandsAndComponents(packages) {
        for (let pkg of packages) {
            const walker = new ClassWalker(pkg);
            const classes = await walker.getAllClasses();
            classes.forEach((command) => this.loadCommand(command));
        }
    }

    /**
     * Load a command into cache.
     * @param {RestrictedCommand} command 
     */
    loadCommand(command) {
        // Checks whether command is a SlashCommand
        if(command instanceof SlashCommand) this.slashcommands.push(command);
        // Checks whether command is a ContextCommand
        if(command instanceof ContextCommand) this.contextcommands.push(command);
    }
}

module.exports = InteractionManager;