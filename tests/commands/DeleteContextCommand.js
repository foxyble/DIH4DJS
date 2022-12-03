const { MessageContextMenuCommandInteraction, Client } = require("discord.js");
const { ContextCommand, Commands } = require("../../src");

class DeleteContextCommand extends ContextCommand.Message {
    constructor() {
        super(Commands.message("delete"));
    }

    /**
     * 
     * @param {Client} client 
     * @param {MessageContextMenuCommandInteraction} interaction 
     */
    execute(client, interaction) {
        const messageId = interaction.targetMessage.id;
        interaction.targetMessage.delete();
        interaction.reply({ content: `Deleted message with id \`${messageId}\`` });
    }
}

module.exports = DeleteContextCommand;