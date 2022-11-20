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
import type { ComponentHandler } from "../structures/ComponentHandler";
import { ButtonInteraction, Collection, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";
import { ComponentIdBuilder } from "../util/ComponentIdBuilder";
import { DIH4DJSLogger } from "../DIH4DJSLogger";

/**
 * Main interface for handling components:
 * (*) Buttons
 * (*) SelectMenus
 * (*) Modals
 * @since v1.1
 */
export class ComponentManager {

    private _buttonHandlers: Collection<string, ComponentHandler>;
    private _selectMenuHandlers: Collection<string, ComponentHandler>;
    private _modalHandlers: Collection<string, ComponentHandler>;

    constructor() {
        this._buttonHandlers = new Collection();
        this._selectMenuHandlers = new Collection();
        this._modalHandlers = new Collection();
    }

    /**
     * Register all {@link ComponentHandler}s
     * @param handler {@link ComponentHandler} instance
     * @since v1.0
     */
    putComponentHandlers(handler: ComponentHandler) {
        if(handler === null) return;
        handler?.handledButtonIds.forEach(s => this._buttonHandlers.set(s, handler));
        handler?.handledSelectMenuIds.forEach(s => this._selectMenuHandlers.set(s, handler));
        handler?.handledModalIds.forEach(s => this._modalHandlers.set(s, handler));
    }

    /**
     * Getters for different handlers
     * @since v1.1
     */
    get buttonHandlers(): Collection<string, ComponentHandler> { return this._buttonHandlers; }
    get selectMenuHandlers(): Collection<string, ComponentHandler> { return this._selectMenuHandlers; }
    get modalHandlers(): Collection<string, ComponentHandler> { return this._modalHandlers; }

    /**
     * Handle all {@link ButtonInteraction}s
     * @param interaction Button interaction response
     * @since v1.0
     */
    handleButton(buttonInteraction: ButtonInteraction) {
        var component = this.buttonHandlers.get(ComponentIdBuilder.split(buttonInteraction.customId)[0]!);
        if(component === null || component === undefined) {
            DIH4DJSLogger.warn(`Button with the id ${buttonInteraction.customId} could not be found.`)
        } else {
            component.handleButton(buttonInteraction);
        }
    }

    /**
     * Handle all {@link SelectMenuInteraction}s
     * @param interaction SelectMenu interaction response
     * @since v1.0
     */
    public handleSelectMenu(selectMenuInteraction: SelectMenuInteraction) {
        var component = this.selectMenuHandlers.get(ComponentIdBuilder.split(selectMenuInteraction.customId)[0]!);
        if(component === null || component === undefined) {
            DIH4DJSLogger.warn(`Select menu with the id ${selectMenuInteraction.customId} could not be found.`);
        } else {
            component.handleSelectMenu(selectMenuInteraction);
        }
    }

    /**
     * Handle all {@link ModalSubmitInteraction}s
     * @param interaction Modal interaction response
     * @since v1.0
     */
    public handleModal(modalInteraction: ModalSubmitInteraction) {
        var modal = this.modalHandlers.get(ComponentIdBuilder.split(modalInteraction.customId)[0]!);
        if(modal === null || modal === undefined) {
            DIH4DJSLogger.warn(`Modal with the id ${modalInteraction.customId} could not be found.`);
        } else {
            modal.handleModalSubmit(modalInteraction);
        }
    }
}