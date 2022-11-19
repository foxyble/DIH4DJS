import 'dotenv/config';

import { Client, IntentsBitField } from 'discord.js';

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
    .setTestingGuild(process.env.TEST_GUILD)
    .setCommandPackages("./systems/")
    .build();

client.login(process.env.TOKEN);

setTimeout(() => client.destroy(), 10000);