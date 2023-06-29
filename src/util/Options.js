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

const ClientStrategy = require("../structures/ClientStrategy");
const RegistrationType = require('./RegistrationType');

/**
 * Main options for setting up DIH4DJS.
 * @typedef {Object} DIH4DJSOptions
 * @property {class} [strategy] The method to use when creating a DIH4DJS instance.
 * @property {string|string[]} [packages] The directories at which to register commands in.
 */

/**
 * Options for all restricted commands.
 * @typedef {Object} CommandOptions
 * @property {Number} [registrationType]
 * @property {Number} [cooldown] Whether the command has a cooldown.
 * @property {bigint[]|CommandPermissionOptions|bigint|number} [permissions] Permissions to apply when registering the command.
 */

/**
 * Options for permissions
 * @typedef {Object} CommandPermissionOptions
 * @property {bigint|string|number} member Default member permissions (if any)
 * @property {boolean} dm DM (Direct Messages) permission
 */

class Options {
    /**
     * Default options.
     * @param {keyof {"dih4djs","command"}} type The type of options to return.
     * @returns {DIH4DJSOptions|CommandOptions}
     */
    static createDefault(type) {
        switch(type) {
            case "dih4djs":
                return {
                    strategy: ClientStrategy.build(null, null),
                    packages: ["commands/", "components/"]
                }
            case "command":
                return {
                    registrationType: RegistrationType.Global,
                    cooldown: 0,
                    permissions: {
                        member: [0],
                        dm: true
                    }
                }
            default:
                throw new Error("Default type has not been defined.")
        }
    }
}

module.exports = Options;