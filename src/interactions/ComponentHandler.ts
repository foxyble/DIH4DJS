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

export abstract class ComponentHandler {
    private buttonIds: string[] = Array.of();
    private selectMenuIds: string[] = Array.of();
    private modalIds: string[] = Array.of();

    public addButtonIds(...ids: string[]) {
        this.buttonIds = ids;
    }

    public getButtonIds(): string[] {
        return this.buttonIds;
    }

    public handleButton(_interaction: ButtonInteraction): void {};

    public addSelectMenuIds(...ids: string[]) {
        this.selectMenuIds = ids;
    }

    public getSelectMenuIds(): string[] {
        return this.selectMenuIds;
    }

    public handleSelectMenu(_interaction: SelectMenuInteraction): void {};

    public addModalIds(...ids: string[]) {
        this.modalIds = ids;
    }

    public getModalIds(): string[] {
        return this.modalIds;
    }

    public handleModalSubmit(_interaction: ModalSubmitInteraction): void {};
}