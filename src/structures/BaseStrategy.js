'use strict';

/**
 * Main interface for a Strategy
 * @abstract
 */
class BaseStrategy {

    /**
     * Add a single listener to a {@link Client} instance.
     * @param {*} clazz the class to add to the client listener 
     */
    addListener(clazz) {}

    addListeners(directory) {

    }
}

module.exports = BaseStrategy;