'use strict';

const {SlashCommand} = require("../../src");
const {SlashCommandSubcommandBuilder} = require("discord.js");

class TestSubCommand extends SlashCommand.Subcommand {

    constructor() {
        super(new SlashCommandSubcommandBuilder().setName("subcommand").setDescription("Subcommand description"));
    }

    execute(client, interaction) {
        super.execute(client, interaction);
    }
}

module.exports = TestSubCommand;