require('dotenv').config();

const { IntentsBitField, Client } = require("discord.js");
const { DIH4DJS } = require("../src");

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

const dih4djs = new DIH4DJSBuilder()
    .setClient(client)
    .setCommandPackages("./systems/")
    .disabledCommandLogging()
    .build();

client.login(process.env.TOKEN);