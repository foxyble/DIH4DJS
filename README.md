<!-- PROJECT SHIELDS -->
<div style="text-align:center;">

![Version][version-shield]
[![Discord][discord-shield]][discord-url]
[![License][license-shield]][license-url]

</div>

<img src="https://github.com/OoP1nk/OoP1nk/blob/main/assets/dih4djs.png?raw=true" />

# About
DIH4DJS is a powerful interaction handler module for the [discord.js](https://https://github.com/discordjs/discord.js) package.

This library is based off of the java package [DIH4JDA](https://github.com/DynxstyGIT/DIH4JDA) with adaptations and improvements along with the obvious change (*pst* its in javascript).

# Installation
**DIH4DJS is built using the latest version of discord.js therefore requiring Node.js version 16.9.0 or newer**
```sh-session
npm install dih4djs
yarn add dih4djs
pnpm add dih4djs
```

If you need help, don't hesitate to join our [discord server][discord-url] to ask your questions or make suggestions.

# Setup/Configuration
For a more indepth description on how to register commands feel free to look at the [Wiki](https://github.com/OoP1nk/DIH4DJS/wiki).

## Setting up the handler
```javascript
const { Client } = require('discord.js');
const { DIH4DJS } = require('dih4djs');

const client = new Client({
    intents: [YOUR_INTENTS]
});

const dih4djs = new DIH4DJS(client, {
    packages: ["./commands/"]
});

client.login("YOUR_TOKEN_HERE");
```

## Creating your first Slash Command
How do you create a slash command? It's very simple! Just create a class in one of the specified package directories when initialising the handler which extends the `SlashCommand` class.

```javascript
class HelloWorldCommand extends SlashCommand {
    constructor() {
        super(Commands.slash("hello", "world"), {
            // Sets the type of registration for this specific command
            registrationType: RegistrationType.Guild,
        });
    }

    /**
     * Runs whenever the command is executed.
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(client, interaction) {

    }
}

module.exports = HelloWorldCommand;
```

# Contributing

When contributing please follow the steps provided: [CONTRIBUTING](https://github.com/OoP1nk/DIH4DJS/.github/CONTIBUTING.md)


<!-- LINK & IMAGES -->
[discord-shield]: https://img.shields.io/discord/1044203446473064488?color=%23406da2&label=Discord&style=for-the-badge
[discord-url]: https://discord.gg/4nsHqQzEwa
[license-shield]: https://img.shields.io/npm/l/dih4djs?color=%23406da2&style=for-the-badge
[license-url]: https://github.com/OoP1nk/DIH4DJS/blob/release/LICENSE
[version-shield]: https://img.shields.io/npm/v/dih4djs/latest?color=%23406da2&label=DIH4DJS&style=for-the-badge