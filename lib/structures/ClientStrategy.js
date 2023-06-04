/*
 * Copyright 2023 OoP1nk
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const { Client } = require("discord.js");
const Strategy = require("./interfaces/Strategy");

/**
 * Method for initialising DIH4DJS for a single {@link Client} instance.
 * @since v3.0.0
 * @extends {Strategy}
 */
class ClientStrategy extends Strategy {

    /**
     * Create an instance of {@link Client}
     * @param {Client} client The {@link Client} to use.
     * @param {string} token The OAuth2 token to use (optional)
     * @returns {ClientStrategy}
     */
    static build(client, token = client.token) {
        const strategy = new ClientStrategy();
        strategy.setClient(client);
        strategy.setToken(token);
        return strategy;
    }

    /**
     * Sets the base client.
     * @param {Client} client 
     */
    setClient(client) {
        this.client = client;
    }

    // -- ABSTRACT --
    addListener(clazz) {
        if (clazz.once) this.client.prependOnceListener(clazz.action, (...args) => clazz.execute(this, this.client, ...args));
        else this.client.prependListener(clazz.action, (...args) => clazz.execute(this, this.client, ...args));
    }
}

module.exports = ClientStrategy;