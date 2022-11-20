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
    ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    SlashCommandSubcommandBuilder, 
    SlashCommandSubcommandGroupBuilder,
    ApplicationCommand,
    ApplicationCommandOptionType
} from "discord.js";

import { InteractionManager } from "../managers/InteractionManager";
import { BaseApplicationCommand } from "./BaseApplicationCommand";

/**
 * @since v1.0
 */
export abstract class SlashCommand extends BaseApplicationCommand<ChatInputCommandInteraction, SlashCommandBuilder> {
    private subcommands: SlashCommand.Subcommand[] = Array.of();
    private subcommandGroups: SlashCommand.SubcommandGroup[] = Array.of();

    /**
     * Returns an array of all {@link Subcommand}s this command contains.
     * @returns An {@link Subcommand} array.
     */
    public getSubcommands() {
        return this.subcommands;
    }

    /**
     * Adds {@link Subcommand}s to this {@link SlashCommand}.
     * @param commands List of {@link Subcommand}s to add.
     */
    public addSubcommands(...commands: SlashCommand.Subcommand[]) {
        for(const subcommand of commands) {
            subcommand.parent = this;
        }
        this.subcommands = commands;
    }

    /**
     * Returns an array of all {@link SubcommandGroup}s this command contains.
     * @returns An {@link SubcommandGroup} array.
     */
    public getSubcommandGroups() {
        return this.subcommandGroups;
    }

    /**
     * Adds {@link SubcommandGroup}s to this {@link SlashCommand}.
     * @param groups List of {@link SubcommandGroup}s to add.
     * @returns 
     */
    public addSubcommandGroups(...groups: SlashCommand.SubcommandGroup[]) {
        for(const group of groups) {
            for(const subcommand of group.getSubcommands()) {
                subcommand.parent = this;
            }
        }
        this.subcommandGroups = groups;
    }

    public asCommand() {
        if(this.getCommandData() === null) return null;
        return InteractionManager.getRetrievedCommands().get(this.getCommandData().name);
    }
}

export namespace SlashCommand {
    export abstract class Subcommand extends BaseApplicationCommand<ChatInputCommandInteraction, SlashCommandSubcommandBuilder> {
        public parent: SlashCommand|null = null;

        /**
         * Gets the {@link SlashCommand} parent for this subcommand.
         * @returns The parent {@link SlashCommand}
         */
        public getParent(): SlashCommand {
            return this.parent!;
        }

        /**
         * Gets the corresponding {@link ApplicationCommand} for this subcommand.
         * @returns 
         */
        public asSubcommand() {
            if(this.getCommandData() === null) return null;
            var cmd = this.parent!.asCommand()!;
            if(cmd === null) return null;
            var subcommands = cmd.options.filter((c) => c.type === ApplicationCommandOptionType.Subcommand);
            cmd.options.filter((c) => c.type === ApplicationCommandOptionType.SubcommandGroup)
                .forEach((s) => subcommands.push(s));
            return subcommands.filter(c => c.name === this.getCommandData().name)[0]||null;
        }
    }
    export class SubcommandGroup extends BaseApplicationCommand<ChatInputCommandInteraction, SlashCommandSubcommandGroupBuilder> {
        private subcommands: Subcommand[];

        private constructor(data: SlashCommandSubcommandGroupBuilder, subcommands: Subcommand[]) {
            super(data);
            this.subcommands = subcommands;
        }

        /**
         * Creates a new instance of the {@link SlashCommandSubcommandGroupBuilder} class.
         * @param data The {@link SlashCommandSubcommandGroupBuilder} class.
         * @param subcommands An array of {@link Subcommand}s.
         * @returns The {@link SlashCommandSubcommandGroupBuilder}.
         */
        public static of(data: SlashCommandSubcommandGroupBuilder, ...subcommands: Subcommand[]): SubcommandGroup {
            if(data === null) throw new Error("SubcommandGroupData may not be null!");
            if(subcommands === null || subcommands.length === 0) throw new Error("Subcommands may not be empty!");
            return new SubcommandGroup(data, subcommands);
        }

        /**
         * @returns The correspondng {@link SlashCommandSubcommandGroupBuilder}.
         */
        public getData(): SlashCommandSubcommandGroupBuilder {
            return this.getCommandData();
        }

        /**
         * @returns An array of {@link SlashCommand.Subcommand}s.
         */
        public getSubcommands() {
            return this.subcommands;
        }
    }
}