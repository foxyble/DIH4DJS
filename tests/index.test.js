require('dotenv').config();

const { DIH4DJS } = require('../lib');
const {Client,GatewayIntentBits} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ]
});

const dih4djs = new DIH4DJS({
    packages: ['1', '2']
}).bind(client);

client.on('ready', () => {
    console.log('Ready!');
    setTimeout(() => {
        console.log('died :)');
        client.destroy();
    }, 5_000);
});

client.login(process.env.TOKEN).catch(console.error);
