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

const Strategy = require("./interfaces/Strategy");
const { ShardingManager } = require('discord.js');

/**
 * Method for initialising DIH4DJS for with {@link ShardingManager}.
 * @since v3.0.0
 * @extends {Strategy}
 */
class ShardingStrategy extends Strategy {

    /**
     * Creates an instance of {@link ShardingMethod}
     * @param {ShardingManager} shardingManager The {@link ShardingManager} to use.
     * @returns {ShardingStrategy}
     */
    static build(shardingManager) {
        const strategy = new ShardingStrategy();
        strategy.setManager(shardingManager);
        strategy.setToken(shardingManager.token);
        return strategy;
    }

    /**
     * Sets the sharding manager.
     * @param {ShardingManager} shardingManager 
     */
    setManager(shardingManager) {
        this.manager = shardingManager;
    }

    // -- ABSTRACT --
    addListener(clazz) {
        this.manager.broadcastEval((client) => {
            if (clazz.once) client.prependOnceListener(clazz.action, (...args) => clazz.execute(this, client, ...args));
            else client.prependListener(clazz.action, (...args) => clazz.execute(this, client, ...args));
        });
    }
}

module.exports = ShardingStrategy;