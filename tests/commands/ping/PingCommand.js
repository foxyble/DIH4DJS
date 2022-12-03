const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");
const { SlashCommand, Commands } = require("../../../src");
const PingRoleCommand = require("./PingRoleCommand");
const PingUserSubcommand = require("./PingUserSubcommand");

class PingCommand extends SlashCommand {
    constructor() {
        super(Commands.slash("ping", "Pings someone or something."),
            {
                permissions: [PermissionFlagsBits.Administrator]
            });

        this.addSubcommandGroups(
            SlashCommand.SubcommandGroup.of(Commands.slash("user", "Pings a user.", ApplicationCommandOptionType.SubcommandGroup),
                new PingUserSubcommand()
            )
        );

        this.addSubcommands(new PingRoleCommand());
    }
}

module.exports = PingCommand;