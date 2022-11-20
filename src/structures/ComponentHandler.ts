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
import type { 
    ButtonInteraction, 
    ModalSubmitInteraction, 
    SelectMenuInteraction 
} from "discord.js";

export type ComponentHandlerOptions = {
    handledButtonIds?: string[];
    handledSelectMenuIds?: string[];
    handledModalIds?: string[]
}

/**
 * @since v1.1
 */
export abstract class ComponentHandler {
    private _handledButtonIds: string[] = Array.of();
    private _handledSelectMenuIds: string[] = Array.of();
    private _handledModalIds: string[] = Array.of();

    constructor(options: ComponentHandlerOptions) {
        if(options.handledButtonIds !== undefined)
            this._handledButtonIds = options.handledButtonIds;
        if(options.handledSelectMenuIds !== undefined)
            this._handledSelectMenuIds = options.handledSelectMenuIds;
        if(options.handledModalIds !== undefined)
            this._handledModalIds = options.handledModalIds;
    }

    /**
     * 
     */
    get handledButtonIds(): string[] {
        return this._handledButtonIds! || [];
    }
    handleButton(_interaction: ButtonInteraction): void {};

    /**
     * 
     */
    get handledSelectMenuIds(): string[] {
        return this._handledSelectMenuIds;
    }
    handleSelectMenu(_interaction: SelectMenuInteraction): void {};

    /**
     * 
     */
    get handledModalIds(): string[] {
        return this._handledModalIds;
    }
    handleModalSubmit(_interaction: ModalSubmitInteraction): void {};
}