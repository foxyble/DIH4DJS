const { DIH4DJS, ClientStrategy } = require('../');
const auth = require('./auth.json');
const {Client,GatewayIntentBits, Events} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ]
});

const dih4djs = new DIH4DJS({
    strategy: ClientStrategy.build(client, auth.token),
    packages: ['./systems/']
});

client.on('ready', () => {
    console.log('Ready!');
    console.log(client.listeners(Events.InteractionCreate))
    setTimeout(() => {
        console.log('died :)');
        client.destroy();
    }, 5_000);
});

client.login(auth.token).catch(console.error);