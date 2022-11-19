/**
 * DIH4DJS is a power package to handle interactions using 
 * the discord.js library.
 * Copyright (C) 2022  OoP1nk
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */
import { BaseInteraction, Events } from "discord.js";
import type { DIH4DJS } from "../DIH4DJS";

import EventListener from "./abstract/EventListener"

class onInteractionCreate extends EventListener {
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

export default onInteractionCreate;