const { ApplicationCommandOptionType } = require("discord.js");
const { SlashCommand, Commands } = require("../../../src");

class PingRoleCommand extends SlashCommand.Subcommand {
    constructor() {
        super(Commands.slash("role", "Pings a role.", ApplicationCommandOptionType.Subcommand)
            .addRoleOption(option => option.setName("role").setDescription("The role you want to ping.").setRequired(true))
        );
    }

    execute(client, interaction) {
        const role = interaction.options.getRole("role");
        interaction.reply({ content: `${role}`, ephemeral: false });
    }
}

module.exports = PingRoleCommand;