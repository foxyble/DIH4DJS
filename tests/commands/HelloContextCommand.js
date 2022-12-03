const {
    UserContextMenuCommandInteraction,
    Client,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    StringSelectMenuInteraction
} = require("discord.js");
const { ContextCommand, Commands } = require("../../src");

class HelloContextCommand extends ContextCommand.User {
    constructor() {
        super(Commands.user("hello"), {
            components: {
                handledSelectMenuIds: ["hru"]
            }
        });
    }

    /**
     * 
     * @param {Client} client 
     * @param {UserContextMenuCommandInteraction} interaction 
     */
    execute(client, interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("hru")
            .setPlaceholder("How are you?")
            .setMaxValues(1)
            .setOptions(
                { label: "Very Good!", value: "VeryGood" },
                { label: "Not so Good :/", value: "NSG" },
                { label: "Ok ig", value: "okIThink" }
            );
        const row = new ActionRowBuilder().addComponents(selectMenu);
        interaction.reply({ content: `Hello ${interaction.targetUser}`, components: [row] });
    }

    /**
     * 
     * @param {StringSelectMenuInteraction} interaction 
     */
    handleStringSelect(interaction) {
        interaction.reply({ content: `You chose: ${interaction.values}` })
    }
}

module.exports = HelloContextCommand;