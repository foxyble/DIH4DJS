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

/**
 * Main options for setting up DIH4DJS.
 * @typedef {Object} DIH4DJSOptions
 * @property {string|string[]} [packages] The directories at which to register commands in.
 * @property {keyof {"onReady", "manual", "auto"}} [deployMethod] Whether the handler should register commands when initialised or not.
 */

const { Client } = require('discord.js');
const path = require("node:path");
const RegistrationType = require("./util/RegistrationType");

/**
 * Main class for interacting with DIH4DJS.
 * @since v3.0.0
 */
class DIH4DJS {
    options;
    clients;

    static DATA_PATH = path.dirname(require.main.filename);
    static defaultRegistrationType = RegistrationType.Global;

    /**
     * Creates a new instance of DIH4DJS.
     * @param {DIH4DJSOptions} options
     */
    constructor(options) {
        this.options = this._validateOptions(options);
    }

    /**
     * Bind a {@link Client} to the new instance of DIH4DJS.
     * @param {Client} client
     * @public
     */
    bind(client) {
        this.clients = Array.from(this.clients).push(client);
        return this;
    }

    /**
     * Validates the current {@link DIH4DJS} instance.
     * @param {DIH4DJSOptions} options Partial options to validate.
     * @private
     */
    _validateOptions(options) {
        // TODO: Return validated options.
        return options;
    }
}

module.exports = DIH4DJS;