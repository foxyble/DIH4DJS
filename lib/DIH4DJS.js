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
 * @property {boolean} [useDefaultListeners] Whether to use the default action listeners or use your own.
 * @property {keyof {"onReady", "manual", "auto"}} [deployMethod] Whether the handler should register commands when initialised or not.
 */

const { EventEmitter } = require('node:events');
const RegistrationType = require("./util/RegistrationType");
const QueueManager = require('./managers/QueueManager');
const ClassWalker = require('./util/ClassWalker');
const {InteractionManager} = require("./index");
const {
    Client,
    DiscordjsTypeError,
    DiscordjsErrorCodes,
    mergeDefault
} = require('discord.js');

/**
 * Main class for interacting with DIH4DJS.
 * @extends {EventEmitter}
 * @since v3.0.0
 */
class DIH4DJS extends EventEmitter {

    static defaultRegistrationType = RegistrationType.Global;

    /** @type {string[]} */
    boundClientIds = []

    DEFAULT_ACTION_PATH = "./actions/defaults/";

    /**
     * Creates a new instance of DIH4DJS.
     * @param {DIH4DJSOptions} options
     */
    constructor(options = {}) {
        super({ captureRejections: true });

        if(typeof options !== 'object' || options === null) {
            throw new DiscordjsTypeError(DiscordjsErrorCodes.InvalidType, 'options', 'object', true);
        }

        /**
         *
         * @type {DIH4DJSOptions}
         */
        this.options = mergeDefault(this.createDefault(), options);

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
    }

    /**
     * Bind a {@link Client} to the new instance of DIH4DJS.
     * @param {Client} client The client to bind to the {@link DIH4DJS} instance.
     * @public
     */
    async bind(client) {
        // Checks whether it's the same client being bound.
        if(!this.boundClientIds.includes(client.id) && this.boundClientIds.length > 0)
            throw new Error("You cannot bind multiple clients to one DIH4DJS instance.");

        // Apply default listeners if enabled.
        if(this.options.useDefaultListeners)
            await this.applyDefaultListeners(client);
    }

    /**
     * Apply the default listeners to a {@link Client} instance.
     * @param {Client} client
     */
    async applyDefaultListeners(client) {
        const walker = new ClassWalker(this.DEFAULT_ACTION_PATH);
        const clazzes = await walker.getAllClasses(true);
        clazzes.forEach((value) =>
            client.on(value.action, (...args) => value.execute({ dih4djs: this, client, ...args}))
        );
    }

    /**
     *
     * @param {number} type
     */
    static setDefaultRegistrationType(type) {
        this.defaultRegistrationType = type;
    }

    _validateOptions() {
        // Package presence check
        if(this.options.packages || this.options.packages.length <= 0) {
            return new Error("No packages specified; exiting!");
        }
    }

    /**
     * Validates the current {@link DIH4DJS} instance.
     * @returns {DIH4DJSOptions}
     * @private
     */
    createDefault() {
        return {
            deployMethod: 'auto',
            useDefaultListeners: true
        }
    }
}

module.exports = DIH4DJS;