'use strict';

const { Client } = require("discord.js");
const BaseStrategy = require("./BaseStrategy");

class ClientStrategy extends BaseStrategy {
    
    /**
     * @param {Client} client 
     */
    set client(client) {
        this.client = client;
    }

    get token() {
        return this.client.token;
    }
}

module.exports = ClientStrategy;