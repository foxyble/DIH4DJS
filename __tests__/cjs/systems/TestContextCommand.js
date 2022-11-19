'use strict';

const { Client, UserContextMenuCommandInteraction } = require("discord.js");
const { ContextCommand, Commands } = require("../../dist");

class TestContextCommand extends ContextCommand.User {
    constructor() {
        super(Commands.user("like"));
    }

    /**
     * @param {Client} client 
     * @param {UserContextMenuCommandInteraction} interaction 
     */
    execute(client, interaction) {
        interaction.reply({ content: "test user context", ephemeral: true });
    }
}

module.exports = TestContextCommand;