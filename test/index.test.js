const { DIH4DJS } = require('../lib');
const { token } = require('./auth.json');
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
    console.log(dih4djs.clients)
    setTimeout(() => {
        console.log('died :)');
        client.destroy();
    }, 5_000);
});

client.login(token).catch(console.error);
