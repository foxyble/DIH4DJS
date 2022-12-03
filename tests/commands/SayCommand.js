const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction } = require("discord.js");
const { SlashCommand, Commands } = require("../../src");

class SayCommand extends SlashCommand {
    constructor() {
        super(Commands.slash("say", "Sends a message")
            .addStringOption(option => option.setName("msg").setDescription("What you want to say.")), {
            components: {
                handledModalIds: ["say"]
            }
        }
        );
    }

    execute(client, interaction) {
        const modal = new ModalBuilder()
            .setCustomId("say")
            .setTitle("What would you like to say?")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("say-input")
                        .setLabel("What would you like to say?")
                        .setMaxLength(500)
                        .setStyle(TextInputStyle.Paragraph)
                )
            );
        interaction.showModal(modal);
    }

    /**
     * @param {ModalSubmitInteraction} interaction 
     */
    handleModal(interaction) {
        interaction.reply({ content: `${interaction.fields.getTextInputValue("say-input")}` });
    }
}

module.exports = SayCommand;