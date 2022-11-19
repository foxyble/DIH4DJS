import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder, 
    SlashCommandSubcommandBuilder, 
    SlashCommandSubcommandGroupBuilder,
    ApplicationCommand,
    ApplicationCommandOptionType,
    SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

import { InteractionHandler } from "../../../InteractionHandler";
import { AppCommand } from "./AppCommand";
import { BaseCommand } from "./BaseCommand";

export abstract class SlashCommand extends BaseCommand<ChatInputCommandInteraction, SlashCommandBuilder|Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">|SlashCommandSubcommandsOnlyBuilder> {
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
        return InteractionHandler.getRetrievedCommands().get(this.getCommandData().name);
    }
}

export namespace SlashCommand {
    export abstract class Subcommand extends AppCommand<ChatInputCommandInteraction, SlashCommandSubcommandBuilder> {
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
    export class SubcommandGroup extends AppCommand<ChatInputCommandInteraction, SlashCommandSubcommandGroupBuilder> {
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
        public of(data: SlashCommandSubcommandGroupBuilder, ...subcommands: Subcommand[]): SubcommandGroup {
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