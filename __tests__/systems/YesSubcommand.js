'use strict';

const { ChatInputCommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { Commands, SlashCommand } = require("../../source");

class YesSubcommand extends SlashCommand.Subcommand {
    constructor() {
        super(
            Commands.slash("yes", "Just yes!!", ApplicationCommandOptionType.Subcommand)
        );
    }

    /**
     * @param {Client} client The discord.js client
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(client, interaction) {
        interaction.reply({ content: "yes", ephemeral: true });
    }
}

module.exports = YesSubcommand;