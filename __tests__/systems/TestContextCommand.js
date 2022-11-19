'use strict';

const { Client, MessageContextMenuCommandInteraction } = require("discord.js");
const { ContextCommand, Commands } = require("../../source");

class TestContextCommand extends ContextCommand.Message {
    constructor() {
        super(Commands.message("delete"));
    }

    /**
     * @param {Client} client 
     * @param {MessageContextMenuCommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const message = interaction.targetMessage;
        await message.delete();
        interaction.reply({ content: 'Deleted message: ' + message.id });
    }
}

module.exports = TestContextCommand;