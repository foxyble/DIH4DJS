'use strict';

const { ChatInputCommandInteraction, Client } = require("discord.js");
const { Commands, SlashCommand } = require("../../dist");

class TestCommand extends SlashCommand {
    constructor() {
        super(Commands.slash("test", "OMG! Test command."));
    }

    /**
     * @param {Client} client The discord.js client
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(client, interaction) {
        interaction.reply({ content: "test command", ephemeral: true });
    }
}

module.exports = TestCommand;