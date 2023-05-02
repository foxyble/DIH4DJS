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

class SlashCommand extends BaseApplicationCommand {
    subcommands = Array.of();
    subcommandGroups = Array.of();

    addSubcommands(...commands) {
        for(const subcommand of commands) {
            subcommand.parent = this;
        }
        this.subcommands = commands;
    }

    addSubcommandGroups(...groups) {
        for(const group of groups) {
            for(const subcommand of group.subcommands) {
                subcommand.parent = this;
            }
        }
        this.subcommandGroups = groups;
    }
}

module.exports = SlashCommand;

((SlashCommand) => {
    /**
     * SlashCommand Subcommand
     */
    class Subcommand extends BaseApplicationCommand {
        parent;

        /**
         * Gets the parent SlashCommand of the Subcommand.
         * @returns {SlashCommand}
         */
        set parent(parent) {
            this.parent = parent;
        }
    }
    SlashCommand.Subcommand = Subcommand;

    /**
     * SlashCommand SubcommandGroup
     */
    class SubcommandGroup extends BaseApplicationCommand {
        subcommands;

        constructor(data, subcommands) {
            super(data);
            this.subcommands = subcommands;
        }

        static of(data, ...subcommands) {
            if (data === null) throw new Error("SubcommandGroup data cannot be null");
            if (subcommands === null || subcommands.length === 0) throw new Error("Subcommands cannot be empty");
            return new SubcommandGroup(data, subcommands);
        }
    }
    SlashCommand.SubcommandGroup = SubcommandGroup;

})(SlashCommand = module.exports ||
    (module.exports = {})
);