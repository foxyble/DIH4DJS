<!-- PROJECT SHIELDS -->
<div style="text-align:center;">

![Version][version-shield]
[![Discord][discord-shield]][discord-url]
[![License][license-shield]][license-url]

</div>

<img src="https://github.com/OoP1nk/OoP1nk/blob/main/assets/dih4djs.png?raw=true" style="margin: auto;" />

---

# About
DIH4DJS is a power interaction and component handler module for discord.js.

In DIH4DJS you register once instance and link one (or multiple) discord.js Client
instances to have the ability shard your bot whenever you need to; This is done
by the `DIH4DJS#bind()` method. 

By having the bind method, it allows you to initialise DIH4DJS in the root file (`src/index.js`) but 
bind multiple clients when running the sharding file (`src/botshard.js`) so you dont create multiple
instances of DIH4DJS making it cleaner to use and more viable.

Have any questions? need assistance? or even make a suggestion! Join our [Discord][discord-url]!

# Installation
**DIH4DJS is built using the latest version on discord.js therefore requiring Node.js version 16.9.0 or newer**
```sh-session
npm install dih4djs
yarn add dih4djs
pnpm add dih4djs
```
# Setup/Configuration
For a more in-depth description on how to register commands feel free to look at the [Wiki](https://github.com/OoP1nk/DIH4DJS/wiki).

## Basic Setup
```javascript
// Modules
const { Client } = require('discord.js');
const { DIH4DJS } = require('dih4djs');

// Create the discord.js Client Instance
const client = new Client({
    intents: [YOUR_INTENTS]
});

// Create the new instance of DIH4DJS
const dih4djs = new DIH4DJS({
    // The directory's at which to listen in
    packages: ["*/commands/", "*/components"],
    // The method at which to deploy commands to the discord API
    deployMethod: "onReady"
});

// Bind a client instance to DIH4DJS
dih4djs.bind(client);

// Login your client
client.login("YOUR_TOKEN_HERE");
```

# Contributing
When contributing please follow the steps provided: [CONTRIBUTING](https://github.com/OoP1nk/DIH4DJS/.github/CONTIBUTING.md)

<!-- LINK & IMAGES -->
[discord-shield]: https://img.shields.io/discord/1044203446473064488?color=%23406da2&label=Discord&style=for-the-badge
[discord-url]: https://discord.gg/SUF7PFhnNb
[license-shield]: https://img.shields.io/npm/l/dih4djs?color=%23406da2&style=for-the-badge
[license-url]: https://github.com/OoP1nk/DIH4DJS/blob/release/LICENSE
[version-shield]: https://img.shields.io/npm/v/dih4djs/latest?color=%23406da2&label=DIH4DJS&style=for-the-badge