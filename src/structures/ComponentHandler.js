'use strict';

/**
 * Component handler options
 * @typedef ComponentHandlerOptions
 * @property {string[]} [handledButtonIds] An array of all handled button ids.
 * @property {string[]} [handledSelectMenuIds] An array of all handled select menu ids
 * @property {string[]} [handledModalIds] An array of all handled modal ids.
 */

/**
 * Base class for handling components
 * (*) Buttons
 * (*) SelectMenus
 * (*) Modals
 * @abstract
 * @since v1.2
 */
class ComponentHandler {
    /**
     * @param {ComponentHandlerOptions} options 
     */
    constructor(options) {
        this.options = options;
    }

    /**
     * @returns A list of handled button ids.
     */
    get handledButtons() { return this.options.handledButtonIds || []; }

    /**
     * Method that runs if a button id is handled.
     * @param interaction The interaction to handle.
     */
    handleButton(interaction) { }

    /**
     * @returns A list of handled select menu ids.
     */
    get handledSelectMenus() { return this.options.handledSelectMenuIds || []; }

    /**
     * Method that runs if a select menu id is handled.
     * @param interaction The interaction to handle.
     */
    handleStringSelect(interaction) { }
    handleUserSelect(interaction) { }
    handleChannelSelect(interaction) { }
    handleMentionableSelect(interaction) { }

    /**
     * @returns A list of handled modal ids.
     */
    get handledModals() { return this.options.handledModalIds || []; }

    /**
     * Method that runs if a modal id is handled.
     * @param interaction The interaction to handle.
     */
    handleModal(interaction) { }
}

module.exports = ComponentHandler;