require('dotenv').config();

const { join } = require('node:path');
const { Client, IntentsBitField } = require("discord.js");
const { DIH4DJSBuilder } = require("../dist");

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
    .setDirectory(join(__dirname, './systems'))
    .build();

client.login(process.env.TOKEN);