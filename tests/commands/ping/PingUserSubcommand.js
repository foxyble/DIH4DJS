const { ApplicationCommandOptionType } = require("discord.js");
const { SlashCommand, Commands } = require("../../../src");

class PingUserSubcommand extends SlashCommand.Subcommand {
    constructor() {
        super(Commands.slash("from-id", "Pings a user via their id.", ApplicationCommandOptionType.Subcommand)
            .addStringOption(option => option.setName("id").setDescription("the user id.").setRequired(true))
        );
    }

    execute(client, interaction) {
        interaction.reply({ content: `<@${interaction.options.getString("id")}>`, ephemeral: false });
    }
}

module.exports = PingUserSubcommand;