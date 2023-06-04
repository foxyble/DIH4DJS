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

const { EventEmitter } = require('node:events');
const RegistrationType = require("./util/RegistrationType");
const QueueManager = require('./managers/QueueManager');
const InteractionManager = require("./managers/InteractionManager");
const Options = require('./util/Options');
const {
    DiscordjsTypeError,
    DiscordjsErrorCodes,
    mergeDefault,
    DiscordjsError
} = require('discord.js');
const Strategy = require('./structures/interfaces/Strategy');

/**
 * Main class for interacting with DIH4DJS.
 * @extends {EventEmitter}
 * @since v3.0.0
 */
class DIH4DJS extends EventEmitter {

    static defaultRegistrationType = RegistrationType.Global;

    constructor(options = {}) {
        super({ captureRejections: true });

        if(typeof options !== 'object' || options === null) {
            throw new DiscordjsTypeError(DiscordjsErrorCodes.InvalidType, 'options', 'object', true);
        }

        /**
         * The options dih4djs has been initialised with.
         * @type {DIH4DJSOptions}
         */
        this.options = mergeDefault(Options.createDefault("dih4djs"), options);

        this._validateOptions();

        /**
         * Interface to add, remove and update commands.
         * @type {QueueManager}
         */
        this.queue = new QueueManager(this);

        /**
         * Interface to manage individual interactions.
         * @type {InteractionManager}
         */
        this.interactionManager = new InteractionManager(this);

        try {
            // Starts DIH4DJS
            void this.start0();
        } catch (err) {
            console.log(err);
            process.exit(0);
        }
    }

    /**
     * Internal method to start DIH4DJS.
     * @private
     */
    async start0() {
        /**
         * Discord ID of the Bot User.
         * @type {string}
         */
        this.clientId = await this.queue.fetchBotUser().id;

        // Set default listeners.
        this.options.strategy.addListeners('./lib/events/');

        // TODO: Start Queue
    }

    /**
     * Set the default registration type for commands.
     * @param {number} type
     */
    static setDefaultRegistrationType(type) {
        this.defaultRegistrationType = type;
    }

    /**
     * Validates the given set of options:
     *  - Checks that command/component packages/directories have been set.
     *  - Checks that the correct deployment method has been set.
     * @private
     */
    _validateOptions() {
        // Checks method
        if(!this.options.strategy || !(this.options.strategy instanceof Strategy))
            throw new DiscordjsError(DiscordjsErrorCodes.InvalidElement);
        // Package presence check
        if(!this.options.packages || (typeof this.options.packages === 'object' && this.options.packages >= 0))
            throw new DiscordjsError(DiscordjsErrorCodes.ClientInvalidOption);
    }
}

module.exports = DIH4DJS;