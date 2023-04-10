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

const { Client, Events} = require('discord.js');

/**
 * Internal listener for {@link Client} events.
 * @abstract
 * @since v3.0.0
 */
class ActionListener {
    action;

    constructor(action) {
        this.action = action;
    }

    /**
     * Run when a {@link Client} action in emitted.
     * @param {DIH4DJS} dih4djs The current DIH4DJS instance.
     * @param {Client} client The client at which is bound.
     * @param {...any} args Any additional arguments emitted with the action.
     */
    execute({ dih4djs, client, ...args }) {};
}

module.exports = ActionListener;