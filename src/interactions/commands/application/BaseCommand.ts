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
import type { RegistrationType } from "./RegistrationType";

import { DIH4DJS } from "../../../DIH4DJS";
import { AppCommand } from "./AppCommand";

export abstract class BaseCommand<E, T> extends AppCommand<E, T> {
    private registrationType: RegistrationType = DIH4DJS.getDefaultRegistrationType();
    private queueableGuilds: string[] = Array.of();

    /**
     * The {@link RegistrationType} the command got assigned.
     * @returns the {@link RegistrationType}.
     */
    public getRegistrationType(): RegistrationType {
        return this.registrationType;
    }

    /**
     * How the command should be queued.
     * @param type the {@link RegistrationType} to set.
     */
    public setRegistrationType(type: RegistrationType): void {
        this.registrationType = type;
    }

    public setQueuableGuilds(...guilds: string[]) {
        this.queueableGuilds = guilds;
    }

    public getQueueableGuilds(): string[] {
        return this.queueableGuilds;
    }
}