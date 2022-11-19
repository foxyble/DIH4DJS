'use strict';

const { ChatInputCommandInteraction, Client, ButtonInteraction, ButtonBuilder } = require("discord.js");
const { Commands, SlashCommand, RegistrationType, ComponentIdBuilder } = require("../../../dist");

class PingCommand extends SlashCommand {
    constructor() {
        super(Commands.slash("ping", "Gets the bots ping"));
        this.setRegistrationType(RegistrationType.Private);
        this.addButtonIds("test-button");
    }

    /**
     * @param {Client} client The discord.js client
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(client, interaction) {
        const testBtn = new ButtonBuilder()
            .setCustomId(ComponentIdBuilder.build("test-button"))
        interaction.reply({ content: `${Math.round(client.ws.ping)}ms`, ephemeral: true });
    }

    /**
     * @param {ButtonInteraction} interaction 
     */
    handleButton(interaction) {
        interaction.reply({ content: "button worked", ephemeral: true });
    }
}

module.exports = PingCommand;