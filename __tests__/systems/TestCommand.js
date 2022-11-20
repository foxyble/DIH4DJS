'use strict';

const { ChatInputCommandInteraction, Client } = require("discord.js");
const { Commands, SlashCommand } = require("../../source");
const YesSubcommand = require("./YesSubcommand");

class TestCommand extends SlashCommand {
    constructor() {
        super(Commands.slash("test", "OMG! Test command."));

        this.addSubcommands(new YesSubcommand());
    }
}

module.exports = TestCommand;