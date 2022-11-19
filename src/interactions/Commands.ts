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
import { 
    SlashCommandBuilder, 
    ContextMenuCommandBuilder, 
    ApplicationCommandType, 
    ContextMenuCommandType, 
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder
} from 'discord.js';

export class Commands {
    /**
     * Create a slash command builder.
     * @param name The command name
     * @param description The command description
     * @returns {@link SlashCommandBuilder}
     */
    public static slash(name: string, description: string): SlashCommandBuilder {
        return new SlashCommandBuilder().setName(name).setDescription(description);
    }

    /**
     * Create a slashcommand subcommand builder.
     * @param name The command name
     * @param description The command description
     * @returns {@link SlashCommandSubcommandBuilder}
     */
    public static slashSub(name: string, description: string): SlashCommandSubcommandBuilder {
        return new SlashCommandSubcommandBuilder().setName(name).setDescription(description);
    }

    /**
     * Create a slashcommand subcommand group builder.
     * @param name The command name
     * @param description The command description
     * @returns {@link SlashCommandSubcommandGroupBuilder}
     */
    public static slashGroup(name: string, description: string): SlashCommandSubcommandGroupBuilder {
        return new SlashCommandSubcommandGroupBuilder().setName(name).setDescription(description);
    }

    /**
     * Create a context command builder for the specified type.
     * @param type The command type
     * @param name The command name
     * @returns {@link ContextMenuCommandBuilder}
     */
    public static context(type: ContextMenuCommandType, name: string): ContextMenuCommandBuilder {
        return new ContextMenuCommandBuilder().setType(type).setName(name);
    }

    /**
     * Create a message context command builder.
     * @param name The command name
     * @returns {@link ContextMenuCommandBuilder}
     */
    public static contextMessage(name: string): ContextMenuCommandBuilder {
        return new ContextMenuCommandBuilder().setType(ApplicationCommandType.Message).setName(name);
    }

    /**
     * Create a user context command builder.
     * @param name The command name.
     * @returns {@link ContextMenuCommandBuilder}
     */
    public static contextUser(name: string): ContextMenuCommandBuilder {
        return new ContextMenuCommandBuilder().setType(ApplicationCommandType.User).setName(name);
    }
}