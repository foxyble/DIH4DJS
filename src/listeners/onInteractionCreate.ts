import { BaseInteraction, Events } from "discord.js";
import type { DIH4DJS } from "../index";

import EventListener from "./abstract/EventListener"

export default class onInteractionCreate extends EventListener {
    constructor() {
        super(Events.InteractionCreate);
    }

    onExecute(dih4djs: DIH4DJS, interaction: BaseInteraction): void {
        const handler = dih4djs.getInteractionHandler();
        /**
         * Handle SlashCommand Interaction
         */
        if(interaction.isChatInputCommand()) {handler.handleSlashCommand(interaction);};

        /**
         * Handle MessageContextCommand Interaction
         */
        if(interaction.isMessageContextMenuCommand()) {handler.handleMessageContextCommand(interaction);};

        /**
         * Handle UserContextCoommand Interaction
         */
        if(interaction.isUserContextMenuCommand()) {handler.handleUserContextCommand(interaction);};

        /**
         * Handle Button Interaction
         */
        if(interaction.isButton()) {handler.handleButton(interaction);};

        /**
         * Handle SelectMenu Interaction
         */
        if(interaction.isSelectMenu()) {handler.handleSelectMenu(interaction);};

        /**
         * Handle ModalSubmit Interaction
         */
        if(interaction.isModalSubmit()) {handler.handleModal(interaction);};
    }
}