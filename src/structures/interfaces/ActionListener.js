'use strict';

/**
 * Main interface for events.
 * @abstract
 */
class ActionListener {
    /**
     * @param {string} event 
     */
    constructor(event) {
        this.eventName = event;
    }

    async execute(...args) { }
}

module.exports = ActionListener;