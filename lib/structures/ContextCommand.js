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

const BaseApplicationCommand = require('./BaseApplicationCommand');

/**
 * Main interface for a discord.js ContextCommand.
 * @extends {ApplicationCommand}
 * @since v1.0.0
 */
class ContextCommand extends BaseApplicationCommand {}

module.exports = ContextCommand;

((ContextCommand) => {
    // User ContextCommand
    class User extends ContextCommand {}
    ContextCommand.User = User;
    // Message ContextCommand
    class Message extends ContextCommand {}
    ContextCommand.Message = Message;
})(ContextCommand = exports.ContextCommand ||
    (exports.ContextCommand = {})
);