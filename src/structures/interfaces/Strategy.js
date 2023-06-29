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

const ActionListener = require("./ActionListener");
const ClassWalker = require('../../util/ClassWalker');

/**
 * Main class for a DIH4DJS method
 * @abstract
 * @since v3.0.0
 */
class Strategy {

    /**
     * Sets the token for the strategy.
     * @param {string} token The discord OAuth2 token.
     */
    setToken(token) {
        this.token = token;
    }

    /**
     * Add a single listener to a {@link Client} instance.
     * @param {new<T extends ActionListener>()} clazz The class to add to the client listener.
     */
    addListener(clazz) { }

    /**
     * Add all listeners inside a directory to a {@link Client} instance.
     * @param {string} directory The directory at which all listeners are held.
     */
    addListeners(directory) {
        const walker = new ClassWalker(directory);
        walker.getAllClasses(true).then((classes) => {
            classes.forEach((clazz) => {
                const actionListener = new clazz();
                this.addListener(actionListener);
            });
        }).catch((reason) => console.error(reason));
    }
}

module.exports = Strategy;