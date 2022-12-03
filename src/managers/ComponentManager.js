const { Collection, ModalSubmitInteraction, ButtonInteraction, AnySele, BaseInteraction, MessageComponentInteraction } = require("discord.js");
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
    handleButton(buttonInteraction) {
        const id = ComponentIdBuilder.split(buttonInteraction.customId)[0];
        const button = this.buttonHandlers.get(id);
        if (button !== null && button !== undefined) {
            button.handleButton(buttonInteraction);
        } else {
            DIH4DJSLogger.warn(`Button with the id ${id} could not be found.`, DIH4DJSLogger.Type.ButtonNotFound)
        }
    }

    /**
     * Handle all {@link selectMenuInteraction}s.
     * @param {MessageComponentInteraction} interaction 
     */
    handleSelectMenu(interaction) {
        const selectMenu = this.selectMenuHandlers.get(ComponentIdBuilder.split(interaction.customId)[0]);
        if (!selectMenu || selectMenu === null) {
            DIH4DJSLogger.warn(`SelectMenu with the id ${interaction.customId} could not be found.`, DIH4DJSLogger.Type.SelectMenuNotFound)
        } else {
            if (interaction.isStringSelectMenu()) selectMenu.handleStringSelect(interaction);
            if (interaction.isUserSelectMenu()) selectMenu.handleUserSelect(interaction);
            if (interaction.isChannelSelectMenu()) selectMenu.handleChannelSelect(interaction);
            if (interaction.isMentionableSelectMenu()) selectMenu.handleMentionableSelect(interaction);
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