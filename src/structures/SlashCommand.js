'use strict';

const { ApplicationCommand, ApplicationCommandOptionType, SlashCommandSubcommandGroupBuilder } = require("discord.js");
const BaseApplicationCommand = require("./BaseApplicationCommand");

/**
 * Represents a slashcommand.
 * @since v1.2
 */
class SlashCommand extends BaseApplicationCommand {
    subcommands = Array.of();
    subcommandGroups = Array.of();

    /**
     * Add a set of Subcommands to this slashcommand.
     * @param  {...any} commands 
     */
    addSubcommands(...commands) {
        for (const subcommand of commands) {
            subcommand.parent = this;
        }
        this.subcommands = commands;
    }

    /**
     * Add subcommand groups to this slashcommand.
     * @param  {...any} groups 
     */
    addSubcommandGroups(...groups) {
        for (const group of groups) {
            for (const subcommand of group.subcommands) {
                subcommand.parent = this;
            }
        }
        this.subcommandGroups = groups;
    }

    /**
     * Gets the subcommand as an ApplicationCommand instance.
     * @returns {ApplicationCommand}
     */
    asCommand() {
        if (this.data === null) return null;
        return // InteractionManager.getRetrievedCommands().get(this.data.name);
    }
}

module.exports = SlashCommand;

(function (SlashCommand) {
    /**
     * Represents a subcommand for a parent
     * slashcommand.
     * @since v1.2
     */
    class SubCommand extends BaseApplicationCommand {
        _parent = null;

        /**
         * Gets the parent {@link SlashCommand}.
         * @returns {SlashCommand}
         */
        get parent() { return this._parent; }

        /**
         * Set the parent slashcommand of this subcommand.
         */
        set parent(parent) { this._parent = parent }

        /**
         * Gets the subcommand as an ApplicationCommand instance.
         * @returns {ApplicationCommand|null}
         */
        asSubcommand() {
            if (this.data === null) return null;
            const cmd = this.parent.asCommand();
            const subcommands = cmd.options.filter((c) => c.type === ApplicationCommandOptionType.Subcommand);
            cmd.options.filter((c) => c.type === ApplicationCommandOptionType.SubcommandGroup)
                .forEach((s) => subcommands.push(s));
            return subcommands.filter(c => c.name === this.data.name)[0] || null;
        }
    }
    SlashCommand.Subcommand = SubCommand;
    /**
     * Represents a slashcommand subcommand group.
     * @since v1.2
     */
    class SubcommandGroup extends BaseApplicationCommand {
        subcommands = Array.of();

        constructor(data, ...commands) {
            super(data);
            this.subcommands = commands;
        }

        /**
         * Creates a new instance of SubcommandGroup.
         * @param {SlashCommandSubcommandGroupBuilder} data 
         * @param  {SubCommand[]} subcommands 
         * @returns {SubcommandGroup}
         */
        static of(data, ...subcommands) {
            if (data === null) throw new Error("SubcommandGroup data may not be null.");
            if (subcommands === null || subcommands.length === 0) throw new Error("Subcommands may not be empty.");
            return new SubcommandGroup(data, ...subcommands);
        }
    }
    SlashCommand.SubcommandGroup = SubcommandGroup;
})(SlashCommand = module.exports || (module.exports = {}));