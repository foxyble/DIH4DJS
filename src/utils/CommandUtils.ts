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
import type { RegistrationType } from '../interactions/commands/application/RegistrationType';
import type { SlashCommand } from '../interactions/commands/application/SlashCommand';
import type { ContextCommand } from '../interactions/commands/application/ContextCommand';

import path from 'node:path';
import { Pair } from './Pair';

export class CommandUtils {
    /**
     * Used to create one command name out of the SlashCommand, SlashSubCommandGroup and SlashSubCommand.
     * @param args The arguments as {@link string}s you want to join together.
     * @returns combined string
     */
    public static buildCommandPath(...args: string[]) {
        return args.join(" ");
    }

    public static filterByType(pair: Pair<SlashCommand[], ContextCommand<any>[]>, registrationType: RegistrationType) {
        return new Pair(
            pair.getFirst().filter(c => c.getRegistrationType() === registrationType),
            pair.getSecond().filter(c => c.getRegistrationType() === registrationType)
        );
    }

    public static getNames(command: ContextCommand<any>[], slash: SlashCommand[]) {
        var names: string = "";
        command.forEach((c) => names += names.length === 0 ? `${c.getCommandData().name}` : `, ${c.getCommandData().name}`);
        slash.forEach((c) => names += names.length === 0 ? `${c.getCommandData().name}` : `, ${c.getCommandData().name}`);
        return names;
    }

    /**
     * Gets the root path of the project.
     * @returns The root path of project.
     */
    public static getRootPath(): string {
        const main = path.resolve(__dirname);
        if(main !== undefined && main.includes("/node_modules")) {
            return main.split("/node_modules")[0]!;
        } else {
            return path.dirname(require.main?.filename!);
        }
    }
}