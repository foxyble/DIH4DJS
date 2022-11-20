require('dotenv').config();

const { Client, IntentsBitField } = require("discord.js");
const { DIH4DJS, DIH4DJSLogger } = require("../source");

const IntentFlags = IntentsBitField.Flags;
const client = new Client({
    intents: [
        IntentFlags.Guilds,
        IntentFlags.GuildBans,
        IntentFlags.GuildInvites,
        IntentFlags.GuildMessages,
        IntentFlags.MessageContent
    ]
});

const dih4djs = new DIH4DJS(client, {
    packages: ["./systems/"],
    logging: {
        blocked: [
            DIH4DJSLogger.Type.SlashCommandRegistered
        ]
    }
});

client.login(process.env.TOKEN);