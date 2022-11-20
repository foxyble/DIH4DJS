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

import type { ApplicationCommand, Guild } from "discord.js";
import type { ContextCommand } from "./ContextCommand";
import type { SlashCommand } from "./SlashCommand";

import { Pair } from "../util/Pair";
import { DIH4DJSLogger } from "../DIH4DJSLogger";

/**
 * @since v1.0
 */
export class SmartQueue {
    private slashCommands: SlashCommand[];
    private contextCommands: ContextCommand<any>[];

    constructor(slashCommands: SlashCommand[], contextCommands: ContextCommand<any>[]) {
        this.slashCommands = slashCommands;
        this.contextCommands = contextCommands;
    }

    /**
     * Compares the specified {@link Guild} with aready existing commands, removes duplicates.
     * @param existing A list of all existing {@link ApplicationCommand}
     * @returns A {@link Pair} with the remaining {@link SlashCommandBuilder} & {@link ContextMenuCommandBuilder}.
     * @since v1.0
     */
    checkGlobal(existing: ApplicationCommand[]) {
        if(existing.length !== 0) {
            return this.removeDuplicates(existing);
        }
        return new Pair(this.slashCommands, this.contextCommands);
    }

    /**
     * Compares the specified {@link Guild} with aready existing commands, removes duplicates.
     * @param existing A list of all existing {@link ApplicationCommand}
     * @param guild The {@link Guild} to retrieve the already existing commands.
     * @returns A {@link Pair} with the remaining {@link SlashCommandBuilder} & {@link ContextMenuCommandBuilder}.
     * @since v1.0
     */
    checkGuild(existing: ApplicationCommand[], guild: Guild) {
        if(existing.length !== 0) {
            return this.removeDuplicates(existing, guild);
        }
        return new Pair(this.slashCommands, this.contextCommands);
    }

    /**
     * Removes all duplicate {@link ApplicationCommand}
     * @param existing A list of all existing {@link ApplicationCommand}
     * @param guild An optional guild parameter which is used with {@link SmartQueue#checkGuild}
     * @returns A {@link Pair} with the remaining {@link SlashCommandBuilder} & {@link ContextMenuCommandBuilder}.
     * @since v1.0
     */
    private removeDuplicates(existing: ApplicationCommand[], guild?: Guild) {
        var global: boolean = guild === undefined;
        var prefix = `[${global ? "Global" : guild!.name}] `;
        DIH4DJSLogger.info(prefix + `Found ${existing.length} existing command(s)`, DIH4DJSLogger.Type.SmartQueue);
        existing.forEach((cmd, idx) => {
            if(this.contextCommands.map((data) => cmd.name === data.getCommandData().name)
                    || this.slashCommands.map((data) => cmd.name === data.getCommandData().name)) {
                existing.splice(idx, 1);
            }
            return;
        });
        this.contextCommands.forEach((data, idx) => existing.map(p => {
            if(p.name === data.getCommandData().name) this.contextCommands.splice(idx, 1);
        }));
        this.slashCommands.forEach((data, idx) => existing.map(p => {
            if(p.name === data.getCommandData().name) this.slashCommands.splice(idx, 1);
        }));
        return new Pair(this.slashCommands, this.contextCommands);
    }
}