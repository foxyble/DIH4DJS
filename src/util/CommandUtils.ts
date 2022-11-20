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
import type { RegistrationType } from './RegistrationType';
import type { SlashCommand } from '../structures/SlashCommand';
import type { ContextCommand } from '../structures/ContextCommand';
import { Pair } from './Pair';

/**
 * A utility class that contains some useful methods regarding commands.
 * @since v1.0
 */
export class CommandUtils {
    /**
     * Used to create one command name out of the SlashCommand, SlashSubCommandGroup and SlashSubCommand.
     * @param args The arguments as {@link string}s you want to join together.
     * @returns Combined string
     * @since v1.0
     */
    public static buildCommandPath(...args: string[]) {
        return args.join(" ");
    }

    /**
     * Filter given commands by {@link RegistrationType}.
     * @param pair The commands to be filtered.
     * @param registrationType The type to filter by.
     * @returns {@link Pair} of filtered commands.
     * @since v1.0
     */
    public static filterByType(pair: Pair<SlashCommand[], ContextCommand<any>[]>, registrationType: RegistrationType): Pair<SlashCommand[], ContextCommand<any>[]> {
        return new Pair(
            pair.first.filter(c => c.registrationType === registrationType),
            pair.second.filter(c => c.registrationType === registrationType)
        );
    }

    /**
     * Builds a comma spread list of command names.
     * @param command The list of context commands.
     * @param slash The list of slash commands.
     * @returns A comma spread list of command names.
     * @since v1.0
     */
    public static getNames(command: ContextCommand<any>[], slash: SlashCommand[]) {
        var names: string = "";
        command.forEach((c) => names += names.length === 0 ? `${c.getCommandData().name}` : `, ${c.getCommandData().name}`);
        slash.forEach((c) => names += names.length === 0 ? `${c.getCommandData().name}` : `, ${c.getCommandData().name}`);
        return names;
    }
}