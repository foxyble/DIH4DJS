const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { SlashCommand, Commands, ComponentIdBuilder } = require("../../src");

class PollCommand extends SlashCommand {
    constructor() {
        super(Commands.slash("poll", "Creates a poll with 2 options"), {
            cooldown: 5000,
            permissions: [PermissionFlagsBits.ManageMessages],
            components: {
                handledButtonIds: ["poll"]
            }
        });
    }

    execute(client, interaction) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(ComponentIdBuilder.build("poll", 1))
                .setLabel("1")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(ComponentIdBuilder.build("poll", 2))
                .setLabel("2")
                .setStyle(ButtonStyle.Danger),
        );
        interaction.reply({ content: 'POLLLLL!!!!', components: [row] });
    }

    handleButton(interaction) {
        const id = ComponentIdBuilder.split(interaction.customId);
        if (id[1] === "1") {
            interaction.reply({ content: 'You voted 1' });
        } else {
            interaction.reply({ content: 'You voted 2' });
        }
    }
}

module.exports = PollCommand;