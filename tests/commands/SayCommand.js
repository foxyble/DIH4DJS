const { SlashCommand, Commands } = require("../../src");

class SayCommand extends SlashCommand {
    constructor() {
        super(Commands.slash("say", "Sends a message")
            .addStringOption(option => option.setName("msg").setDescription("What you want to say."))
        );
    }

    execute(client, interaction) {
        interaction.reply({ content: interaction.options.getString("msg") });
    }
}

module.exports = SayCommand;