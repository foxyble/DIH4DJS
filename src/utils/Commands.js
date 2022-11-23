'use strict';
const {
    ApplicationCommandOptionType,
    SlashCommandBuilder,
    SlashCommandSubcommandGroupBuilder,
    SlashCommandSubcommandBuilder,
    ContextMenuCommandBuilder
} = require("discord.js");

class Commands {
    /**
     * Creates a new instance of a slashcommand builder:
     * (*) SlashCommandBuilder
     * (*) SubcommandBuilder
     * (*) SubcommandGroupBuilder
     * @param {string} name The name of the command.
     * @param {string} description The description of the command.
     * @param {ApplicationCommandOptionType} [type] The type of builder to return, defaults to
     * slashcommand.
     * @returns {SlashCommandBuilder|SlashCommandSubcommandGroupBuilder|SlashCommandSubcommandBuilder}
     */
    static slash(name, description, type) {
        var builder;
        switch (type) {
            case ApplicationCommandOptionType.Subcommand:
                builder = new SlashCommandSubcommandBuilder();
                break;
            case ApplicationCommandOptionType.SubcommandGroup:
                builder = new SlashCommandSubcommandGroupBuilder();
                break;
            default:
                builder = new SlashCommandBuilder();
        }
        return builder.setName(name).setDescription(description);
    }

    /**
     * Creates a new ContextMenuCommandBuilder.
     * @param {ContextMenuCommandType} type The command type.
     * @param {string} name The name of the command.
     * @returns {ContextMenuCommandBuilder}
     */
    static context(type, name) {
        return new ContextMenuCommandBuilder().setType(type).setName(name);
    }

    /**
     * Creates a new ContextMenuCommandBuilder.
     * @param {string} name The name of the command.
     * @returns {ContextMenuCommandBuilder}
     */
    static message(name) {
        return new ContextMenuCommandBuilder().setType(3).setName(name);
    }

    /**
     * Creates a new ContextMenuCommandBuilder.
     * @param {string} name The name of the command.
     * @returns {ContextMenuCommandBuilder}
     */
    static user(name) {
        return new ContextMenuCommandBuilder().setType(2).setName(name);
    }
}

module.exports = Commands;