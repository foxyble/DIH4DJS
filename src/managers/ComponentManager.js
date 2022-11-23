const { Collection, ModalSubmitInteraction, SelectMenuInteraction, ButtonInteraction } = require("discord.js");
const DIH4DJSLogger = require("../DIH4DJSLogger");
const ComponentHandler = require("../structures/ComponentHandler");
const ComponentIdBuilder = require("../utils/ComponentIdBuilder");

class ComponentManager {
    buttonHandlers = new Collection();
    selectMenuHandlers = new Collection();
    modalHandlers = new Collection();
    constructor() { }

    /**
     * Register all {@link ComponentHandler}s.
     * @param {ComponentHandler} handler 
     */
    putComponentHandlers(handler) {
        if (handler === null) return;
        handler.handledButtons.forEach(s => this.buttonHandlers.set(s, handler));
        handler.handledSelectMenus.forEach(s => this.selectMenuHandlers.set(s, handler));
        handler.handledModals.forEach(s => this.modalHandlers.set(s, handler));
    }

    /**
     * Handle all {@link buttonInteraction}s.
     * @param {ButtonInteraction} buttonInteraction 
     * @returns 
     */
    handledButton(buttonInteraction) {
        const button = this.buttonHandlers.get(ComponentIdBuilder.split(buttonInteraction.customId)[0]);
        if (button !== null && button !== undefined) {
            button.handleButton(buttonInteraction);
        } else {
            DIH4DJSLogger.warn(`Button with the id ${buttonInteraction.customId} could not be found.`, DIH4DJSLogger.Type.ButtonNotFound)
        }
    }

    /**
     * Handle all {@link selectMenuInteraction}s.
     * @param {SelectMenuInteraction} selectMenuInteraction 
     */
    handleSelectMenu(selectMenuInteraction) {
        const selectMenu = this.selectMenuHandlers.get(ComponentIdBuilder.split(selectMenuInteraction.customId)[0]);
        if (selectMenu !== null && selectMenu !== undefined) {
            selectMenu.handleSelectMenu(selectMenuInteraction);
        } else {
            DIH4DJSLogger.warn(`SelectMenu with the id ${selectMenuInteraction.customId} could not be found.`, DIH4DJSLogger.Type.SelectMenuNotFound)
        }
    }

    /**
     * Handle all {@link ModalSubmitInteraction}s.
     * @param {ModalSubmitInteraction} modalInteraction 
     */
    handleModal(modalInteraction) {
        const modal = this.modalHandlers.get(ComponentIdBuilder.split(modalInteraction.customId)[0]);
        if (modal !== null && modal !== undefined) {
            modal.handleModal(modalInteraction);
        } else {
            DIH4DJSLogger.warn(`Modal with the id ${modalInteraction.customId} could not be found.`, DIH4DJSLogger.Type.ModalNotFound);
        }
    }
}

module.exports = ComponentManager;