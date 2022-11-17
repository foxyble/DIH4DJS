import type { 
    Client, 
    BaseInteraction 
} from "discord.js";
import DIH4DJS from "..";

import BaseListener from "../structures/BaseListener";

/**
 * Base class for interactions
 */
export default class InteractionCreateEvent extends BaseListener {

    /**
     * Listens for "interactionCreate" event.
     */
    constructor() {
        super("interactionCreate");
    }

    /**
     * Runs when an interaction is used.
     * @param client The discord.js client instance
     * @param interaction The base interaction
     */
    execute(_client: Client, interaction: BaseInteraction): void {
        const dih4djs = DIH4DJS.getInstance();

        /**
         * Handle SlashCommand Interaction
         */
        if(interaction.isChatInputCommand()) {dih4djs.getInteractionHandler().handleSlashCommand(interaction);};

        /**
         * Handle MessageContextCommand Interaction
         */
        if(interaction.isMessageContextMenuCommand()) {dih4djs.getInteractionHandler().handleMessageContextCommand(interaction);};
 
        /**
         * Handle UserContextCoommand Interaction
         */
        if(interaction.isUserContextMenuCommand()) {dih4djs.getInteractionHandler().handleUserContextCommand(interaction);};
 
        /**
         * Handle Button Interaction
         */
        // if(interaction.isButton()) {dih4djs.getInteractionHandler().handleButton(interaction);};
 
         /**
          * Handle ModalSubmit Interaction
          */
        // if(interaction.isModalSubmit()) {dih4djs.getInteractionHandler().handleModal(interaction);};
    }
}