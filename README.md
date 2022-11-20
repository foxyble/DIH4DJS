# About
DIH4DJS is a powerful interaction handler module for the [discord.js](https://https://github.com/discordjs/discord.js) package.

This library is based off of the java package [DIH4JDA](https://github.com/DynxstyGIT/DIH4JDA) with adaptations with the obvious change (*pst* its in javascript).

# Installation
**DIH4DJS is built using [discord.js v14.6.0]() therefore requiring Node.js version 16.9.0 or newer**
```sh-session
npm install dih4djs
yarn add dih4djs
pnpm add dih4djs
```
# Setup/Configuration
For a more indepth description on how to register commands feel free to look at the [Wiki](https://github.com/OoP1nk/DIH4DJS/wiki).

## Setting up the handler
```javascript
const { Client } = require('discord.js');
const { DIH4DJS, DIH4DJSLogger } = require('dih4djs');

const client = new Client({
    intents: [YOUR_INTENTS]
});

const dih4djs = new DIH4DJS(client, {
    packages: ["./commands/", "./components/"],
    registerOnReady: true,
    logging: {
        enabled: true,
        disabled: [
            DIH4DJSLogger.Type.SlashCommandRegistered
        ]
    }
});

client.login("YOUR_TOKEN_HERE");
```

# Contributing

When contributing please follow the steps provided: [CONTRIBUTING](https://github.com/OoP1nk/DIH4DJS/.github/CONTIBUTING.md)