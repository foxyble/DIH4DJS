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
import type { DIH4DJS } from "../DIH4DJS";
import EventListener from "../structures/EventListener"
import { BaseInteraction, Events } from "discord.js";

/**
 * Interaction event listener.
 * @since v1.0
 */
class onInteractionCreate extends EventListener {
    constructor() {
        super(Events.InteractionCreate);
    }

    onExecute(dih4djs: DIH4DJS, interaction: BaseInteraction): void {
        const interactionHandler = dih4djs.interactionManager;

        /**
         * Command Interaction Handlers
         * @since v1.0
         */
        if(interaction.isChatInputCommand()) {interactionHandler.handleSlashCommand(interaction);};
        if(interaction.isMessageContextMenuCommand()) {interactionHandler.handleMessageContextCommand(interaction);};
        if(interaction.isUserContextMenuCommand()) {interactionHandler.handleUserContextCommand(interaction);};

        const componentHandler = dih4djs.componentManager;

        /**
         * Component Interaction Handlers
         * @since v1.0
         */
        if(interaction.isButton()) {componentHandler.handleButton(interaction);};
        if(interaction.isSelectMenu()) {componentHandler.handleSelectMenu(interaction);};
        if(interaction.isModalSubmit()) {componentHandler.handleModal(interaction);};
    }
}

export default onInteractionCreate;