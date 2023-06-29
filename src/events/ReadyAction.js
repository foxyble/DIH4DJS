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

const {Events} = require("discord.js");
const ActionListener = require("../structures/interfaces/ActionListener");

/**
 * Action listener for the discord.js Client#ready event.
 * @extends {ActionListener}
 */
class ReadyAction extends ActionListener {

    constructor() {
        super(Events.ClientReady, true);
    }

    execute(dih4djs, client) {
        console.log("Inside DIH4DJS");
    }
}

module.exports = ReadyAction;