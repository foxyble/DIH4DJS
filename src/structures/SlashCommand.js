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

const BaseApplicationCommand = require('./BaseApplicationCommand');


/**
 * Base class for a SlashCommand
 * @since v3.0.0
 */
class SlashCommand extends BaseApplicationCommand {
    subcommands = Array.of();
    subcommandGroups = Array.of();

    /**
     * Add a set of subcommands.
     * @param  {SlashCommand.Subcommand} commands
     */
    addSubcommands(...commands) {
        for(const subcommand of commands) {
            subcommand.setParent(this);
            this.data.addSubcommand(subcommand.data);
        }
        this.subcommands = commands;
    }

    /**
     * Add an array of slashcommand groups.
     * @param  {SlashCommand.SubcommandGroup} groups
     */
    addSubcommandGroups(...groups) {
        for(const group of groups) {
            // Adds subcommand group data to base builder
            this.data.addSubcommandGroup(group.data);
            // Sets each subcommands parent
            group.subcommands.forEach((subcommand) => subcommand.setParent(this));
        }
        this.subcommandGroups = groups;
    }
}

module.exports = SlashCommand;

((SlashCommand) => {
    /**
     * SlashCommand Subcommand
     * @since v3.0.0
     */
    class Subcommand extends BaseApplicationCommand {
        parent;

        /**
         * Gets the parent SlashCommand of the Subcommand.
         * @returns {SlashCommand}
         */
        setParent(parent) {
            this.parent = parent;
        }
    }
    SlashCommand.Subcommand = Subcommand;

    /**
     * SlashCommand SubcommandGroup
     * @since v3.0.1
     */
    class SubcommandGroup extends BaseApplicationCommand {

        constructor(data) {
            super(data);

            /**
             * Array of subcommands
             * @type {SlashCommand.Subcommand[]}
             */
            this.subcommands = Array.of();
        }

        /**
         * Add a set of subcommands to the subcommand group
         * @param {SlashCommand.Subcommand} subcommands
         * @returns {SubcommandGroup}
         */
        addSubcommands(...subcommands) {
            for(const subcommand of subcommands) {
                this.data.addSubcommand(subcommand.data);
                this.subcommands.push(subcommand);
            }
            return this;
        }

        static of(data, ...subcommands) {
            if (data === null) throw new Error("SubcommandGroup data cannot be null");
            if (subcommands === null || subcommands.length === 0) throw new Error("Subcommands cannot be empty");
            return new SubcommandGroup(data).addSubcommands(...subcommands);
        }
    }
    SlashCommand.SubcommandGroup = SubcommandGroup;

})(SlashCommand = module.exports ||
    (module.exports = {})
);