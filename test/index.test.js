const { DIH4DJS } = require('../lib');
const { token } = require('./auth.json');
const {Client,GatewayIntentBits} = require('discord.js');

const TestContextCommand = require('./systems/TestContextCommand');

const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ]
});

const dih4djs = new DIH4DJS('wgawg');
dih4djs.bind(client);

client.on('ready', () => {
    console.log('Ready!');
    setTimeout(() => {
        console.log('died :)');
        client.destroy();
    }, 5_000);
});

client.login(token).catch(console.error);
