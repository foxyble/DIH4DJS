'use strict';

const {SlashCommand} = require("../../lib");
const {ContextMenuCommandBuilder, ApplicationCommandType, SlashCommandBuilder} = require("discord.js");
const TestSubCommand = require("./TestSubCommand");

class TestContextCommand extends SlashCommand {
    constructor() {
        super(new SlashCommandBuilder().setName("test").setDescription("testing command"));
        this.addSubcommands(new TestSubCommand())
    }
}

module.exports = TestContextCommand;