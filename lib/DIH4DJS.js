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
 *
 * @typedef {Object} DIH4DJSOptions
 * @property {} []
 */

const RegistrationType = require("./util/RegistrationType");
const {Client} = require('discord.js');
const path = require("node:path");

/**
 * Main class for interacting with DIH4DJS.
 * @since v1.3.0
 */
class DIH4DJS {
    client;

    static DATA_PATH = path.dirname(require.main.filename);
    static defaultRegistrationType = RegistrationType.Global;

    /**
     *
     * @param {Client} client The client instance to use.
     * @param {DIH4DJSOptions} options
     */
    constructor(options) {
        setTimeout(() => {
            console.log(this.client);
        }, 5000);
    }

    /**
     *
     * @param {Client} client
     */
    setClient(client) {
        this.client = client;
    }

    /**
     * Changes the default {@link RegistrationType}
     * @param {Number} type
     * @public
     */
    static setRegistrationType(type) {
        this.defaultRegistrationType = type;
    }

    /**
     * Validates the given options when creating a new instance of {@link DIH4DJS}.
     * @param {DIH4DJSOptions} options The options to validate.
     * @private
     */
    _validateOptions(options) {
        // TODO: Check the options and fill out default for required parameters.
        return options;
    }
}

module.exports = DIH4DJS;