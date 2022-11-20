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
import type { RestrictedCommand } from "../structures/RestrictedCommand";
import type { DIH4DJS } from "../DIH4DJS";

import path from "node:path";
import fs from "node:fs/promises";
import { RegistrationType } from '../util/RegistrationType';
import { ContextCommand } from "../structures/ContextCommand";
import { SlashCommand } from "../structures/SlashCommand";
import { ComponentHandler } from "../structures/ComponentHandler";
import { CommandUtils } from "../util/CommandUtils";
import { DIH4DJSLogger } from "../DIH4DJSLogger";
import { SmartQueue } from "../structures/SmartQueue";
import { Pair } from "../util/Pair";
import { getRootPath } from "../util/Util";
import {
    ApplicationCommand,
    ApplicationCommandType,
    BaseInteraction, 
    ChatInputCommandInteraction, 
    Collection, 
    Guild, 
    GuildMember, 
    MessageContextMenuCommandInteraction, 
    REST, 
    Routes, 
    SlashCommandBuilder, 
    SlashCommandSubcommandBuilder, 
    SlashCommandSubcommandGroupBuilder, 
    UserContextMenuCommandInteraction 
} from "discord.js";

/**
 * Manager to handle interactions.
 * @since v1.0
 */
export class InteractionManager {
    private static RETRIVED_COMMANDS: Collection<string, ApplicationCommand> = new Collection();

    public slashCommands: SlashCommand[];
    public contextCommands: ContextCommand<any>[];

    /** An index of all {@link SlashCommand.Command}s */
    private slashCommandIndex: Collection<string, SlashCommand>;

    /** An index of all {@link SlashCommand.Subcommand}s */
    private subcommandIndex: Collection<string, SlashCommand.Subcommand>;

    /** An index of all {@link ContextCommand.Message}s */
    private messageContextIndex: Collection<string, ContextCommand.Message>;

    /** An index of all {@link ContextCommand.User}s */
    private userContextIndex: Collection<string, ContextCommand.User>;

    private dih4djs: DIH4DJS;

    /**
     * Constructs a new {@link InteractionManager}
     * @param dih4djs The {@link DIH4DJS} instance
     */
    constructor(dih4djs: DIH4DJS) {
        this.dih4djs = dih4djs;

        this.slashCommands = Array.of();
        this.contextCommands = Array.of();

        this.findCommandsAndComponents(dih4djs.packages);

        this.slashCommandIndex = new Collection();
        this.subcommandIndex = new Collection();
        this.messageContextIndex = new Collection();
        this.userContextIndex = new Collection();
    }

    /**
     * Register all commands to the DiscordAPI
     * (*) SlashCommands
     * (*) ContextCommands
     */
    public registerInteractions() {
        const data = new Pair(this.getSlashCommands(), this.getContextCommands());
        if(!this.dih4djs.client.token && !this.dih4djs.client.application) return;
        const token = this.dih4djs.client.token!;
        const appId = this.dih4djs.client.application!.id!;
        const rest = new REST({ version: '10' }).setToken(token);
        this.dih4djs.client.guilds.cache.forEach(async (guild) => {
            const existing = guild.commands.cache;
            var guildData: Pair<SlashCommand[], ContextCommand<any>[]>;
            if(guild.id === this.dih4djs.testingServer)
                guildData = CommandUtils.filterByType(data, RegistrationType.Private);
            else guildData = CommandUtils.filterByType(data, RegistrationType.Guild);
            existing.forEach((e) => this.cacheCommand(e));
            guildData = new SmartQueue(guildData.first, guildData.second).checkGuild(Array.from(existing.values()), guild);
            if(guildData.first || guildData.second) {
                this.upsertGuildCommands(guild, guildData.first, guildData.second);
            }
        });
        rest.get(Routes.applicationCommands(appId)).then((existing: any) => {
            var globalData = CommandUtils.filterByType(data, RegistrationType.Global)
            existing.forEach((e: any) => this.cacheCommand((e as ApplicationCommand)));
            globalData = new SmartQueue(globalData.first, globalData.second).checkGlobal(existing);
            if(globalData.first || globalData.second) {
                this.upsertGlobalCommands(globalData.first, globalData.second)
                DIH4DJSLogger.info("Queued %s global command(s): %ss".replace("%s", `${globalData.first.length + globalData.second.length}`).replace("%ss", CommandUtils.getNames(globalData.second, globalData.first)))
            }
        });
    }

    private async upsertGuildCommands(guild: Guild, slashCommands: SlashCommand[], contextCommands: ContextCommand<any>[]) {
        const token = this.dih4djs.client.token!;
        const appId = this.dih4djs.client.application!.id!;
        const rest = new REST({ version: '10' }).setToken(token);
        var commands: any[] = Array.of();
        slashCommands.map(c => commands.push(c.getCommandData().toJSON()));
        contextCommands.map(c => commands.push(c.getCommandData().toJSON()));
        await rest.put(Routes.applicationGuildCommands(appId, guild.id), { body: commands })
            .catch((reason) => DIH4DJSLogger.warn(reason));
    }

    private async upsertGlobalCommands(slashCommands: SlashCommand[], contextCommands: ContextCommand<any>[]) {
        const token = this.dih4djs.client.token!;
        const appId = this.dih4djs.client.application!.id!;
        const rest = new REST({ version: '10' }).setToken(token);
        var commands: any[] = Array.of();
        slashCommands.map(c => commands.push(c.getCommandData().toJSON()));
        contextCommands.map(c => commands.push(c.getCommandData().toJSON()));
        await rest.put(Routes.applicationCommands(appId), { body: commands })
            .catch((reason) => DIH4DJSLogger.warn(reason));
    }

    private cacheCommand(command: ApplicationCommand) {
        InteractionManager.RETRIVED_COMMANDS.set(command.name, command);
    }

    public static getRetrievedCommands() {
        return this.RETRIVED_COMMANDS;
    }

    /**
     * Find and Register all {@link SlashCommand}s
     * @param packages Location of {@link SlashCommand}s
     */
    private findCommandsAndComponents(packages: string[]): void {
        packages.forEach(async (pkg) => {
            this.registerCommandsAndOrComponenets(pkg);
        });
    }

    /**
     * Loops through each file of a given package.
     * @param pkg The directory where the commands are.
     * @since v1.0
     */
    private async registerCommandsAndOrComponenets(pkg: string) {
        const basePath = path.join(getRootPath(), pkg);
        const files = await fs.readdir(basePath);
        for (const file of files) {
            const filePath = path.join(basePath, file);
            const stat = await fs.lstat(filePath);
            if (stat.isDirectory()) this.registerCommandsAndOrComponenets(path.join(pkg, file));
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                const { default: Command } = await import(filePath);
                const commandOrHandler = new Command();
                if(commandOrHandler instanceof SlashCommand) {
                    this.slashCommands.push(commandOrHandler);
                }
                if(commandOrHandler instanceof ContextCommand) {
                    this.contextCommands.push(commandOrHandler);
                }
                if(commandOrHandler instanceof ComponentHandler) {
                    this.dih4djs.componentManager.putComponentHandlers(commandOrHandler);
                }
            }
        }
    }

    private getSlashCommands() {
        var commands: SlashCommand[] = Array.of();
        for(const command of this.slashCommands) {
            if(command !== null) {
                var data = this.getBaseCommandData(command);
                if(data !== null) {
                    command.setCommandData(data);
                }
                commands.push(command);
            }
        }
        return commands;
    }

    private getBaseCommandData(command: SlashCommand) {
        if(command.getCommandData() === null) return null;
        var commandData = command.getCommandData();
        if(command.addSubcommandGroups() !== null && command.getSubcommandGroups().length !== 0) {
            this.getSubcommandGroupData(command)
                .forEach((g) => (commandData as SlashCommandBuilder).addSubcommandGroup(g));
        }
        if(command.getSubcommands() !== null && command.getSubcommands().length !== 0) {
            this.getSubcommandData(command, command.getSubcommands())
                .forEach((s) => (commandData as SlashCommandBuilder).addSubcommand(s));
        }
        this.slashCommandIndex.set(CommandUtils.buildCommandPath(commandData.name), command);
        DIH4DJSLogger.info(`Registered command: /${command.getCommandData().name} (${command.registrationType})`);
        return commandData;
    }

    private getSubcommandGroupData(command: SlashCommand) {
        var groupDataList: SlashCommandSubcommandGroupBuilder[] = Array.of();
        for(const group of command.getSubcommandGroups()) {
            if(group !== null) {
                var groupData = group.getData();
                if(groupData === null) {
                    DIH4DJSLogger.warn("A SubcommandGroup is missing Subcommands. It will be ignored.");
                    continue;
                }
                if(group.getSubcommands() === null || group.getSubcommands().length === 0) {
                    DIH4DJSLogger.warn("A SubcommandGroup is missing Subcommands. It will be ignored.");
                    continue;
                }
                this.getSubcommandData(command, group.getSubcommands(), groupData.name)
                    .forEach((s) => groupData.addSubcommand(s));
                groupDataList.push(groupData);
            }
        }
        return groupDataList;
    }

    private getSubcommandData(command: SlashCommand, subcommands: SlashCommand.Subcommand[], subGroupName?: string) {
        var subDataList: SlashCommandSubcommandBuilder[] = Array.of();
        for(const subcommand of subcommands) {
            if(subcommand !== null) {
                if(subcommand.getCommandData() === null) {
                    DIH4DJSLogger.warn("Missing SubcommandData. It will be ignored.");
                    continue;
                }
                var commandPath: string;
                if(subGroupName === null || subGroupName === undefined) {
                    commandPath = CommandUtils.buildCommandPath(command.getCommandData().name, subcommand.getCommandData().name);
                } else {
                    commandPath = CommandUtils.buildCommandPath(command.getCommandData().name, subGroupName, subcommand.getCommandData().name);
                }
                this.subcommandIndex.set(commandPath, subcommand);
                DIH4DJSLogger.info(`Registered command: /${command.getCommandData().name} (${command.registrationType})`);
                subDataList.push(subcommand.getCommandData());
            }
        }
        return subDataList;
    }

    private getContextCommands() {
        const commands: ContextCommand<any>[] = Array.of();
        for(const context of this.contextCommands) {
            if(context !== null) {
                const data = this.getContextCommandData(context)!;
                if(data !== null) {
                    context.setCommandData(data);
                }
                commands.push(context);
            }
        }
        return commands;
    }

    /**
     * 
     * @param command 
     * @returns 
     */
    private getContextCommandData(command: ContextCommand<any>) {
        const data = command.getCommandData();
        if(data === null) {
            DIH4DJSLogger.warn("A command is getting ignored, make sure you have set CommandData for all commands.");
            return null;
        }
        if(data.type === ApplicationCommandType.Message) {
            this.messageContextIndex.set(data.name, (command as ContextCommand.Message));
        } else if(data.type === ApplicationCommandType.User) {
            this.userContextIndex.set(data.name, (command as ContextCommand.User));
        } else {
            DIH4DJSLogger.error("Invalid command type %t for Context Command! It will be ignored.".replace("%t", data.type));
            return null;
        }
        DIH4DJSLogger.info(`Registered context command: ${data.name} (${command.registrationType})`);
        return data;
    }

    /**
     * Handle all {@link ChatInputCommandInteraction}s
     * @param interaction SlashCommand interaction response.
     * @since v1.0
     */
    public handleSlashCommand(interaction: ChatInputCommandInteraction) {
        var slashcommand = this.slashCommandIndex.get(interaction.commandName)!;
        var subcommand = this.subcommandIndex.get(CommandUtils.buildCommandPath(interaction.commandName, interaction.options.getSubcommand(false)!));
        if(slashcommand === null && subcommand === null
                || slashcommand === undefined && subcommand === undefined) {
            DIH4DJSLogger.warn(`Couldn't find slashcommand ${interaction.commandName}.`, DIH4DJSLogger.Type.SlashCommandNotFound);
        } else {
            if(subcommand === undefined) {
                DIH4DJSLogger.warn(`Could not find subcommand ${interaction.options.getSubcommand(false)}`, DIH4DJSLogger.Type.SlashCommandNotFound);
            }
            var base = subcommand?.getParent();
            if(interaction.options.getSubcommand(false) !== null && this.passesRequirements(interaction, subcommand!) 
                    && this.passesRequirements(interaction, base!)) {
                return subcommand!.execute(this.dih4djs.client, interaction);
            } else if (this.passesRequirements(interaction, slashcommand)) {
                return slashcommand.execute(this.dih4djs.client, interaction);
            }
        }
    }

    /**
     * Handle all {@link UserContextMenuCommandInteraction}s
     * @param interaction UserContext interaction response.
     * @since v1.0
     */
    public handleUserContextCommand(interaction: UserContextMenuCommandInteraction) {
        var context = this.userContextIndex.get(interaction.commandName)!;
        if(context === null || context === undefined) {
            throw new Error("UserContext command %s is not registered.".replace("%s", interaction.commandName));
        } else {
            if(this.passesRequirements(interaction, context)) {
                context.execute(this.dih4djs.client, interaction);
            }
        }
    }

    /**
     * Handle all {@link MessageContextMenuCommandInteraction}s
     * @param interaction MessageContext interaction response.
     * @since v1.0
     */
    public handleMessageContextCommand(interaction: MessageContextMenuCommandInteraction) {
        var context = this.messageContextIndex.get(interaction.commandName)!;
        if(context === null || context === undefined) {
            throw new Error("MessageContext command %s is not registered.".replace("%s", interaction.commandName));
        } else {
            if(this.passesRequirements(interaction, context)) {
                context.execute(this.dih4djs.client, interaction);
            }
        }
    }

    /**
     * Checks if the {@link BaseInteraction} passes the {@link RestrictedCommand}
     * requirements
     * @param interaction The {@link BaseInteraction}
     * @param command The {@link RestrictedCommand} which contains the (possible) restrictions.
     * @returns Whether the event was fired
     * @since v1.0
     */
    private passesRequirements(interaction: BaseInteraction, command: RestrictedCommand) {
        var userId = interaction.user.id;
        var userIds = command.requiredGuilds;
        var roleIds = command.requiredRoles;
        if(userIds !== null && userIds.length !== 0 && !roleIds.includes(userId)) {
            return false;
        }
        if(interaction.guild && interaction.member !== null) {
            var member: GuildMember = (interaction.member as GuildMember);
            if(roleIds !== null && roleIds.length !== 0 && !member.roles.cache.find(r => roleIds.includes(r.id))) {
                return false;
            }
        }
        // Check if the command has enabled some sort of cooldown
        if(command.cooldown !== 0) {
            if(command.hasCooldown(userId)) {
                return false;
            } else {
                command.applyCooldown(userId, (Date.now() + command.cooldown));
            }
        }
        if(interaction.isChatInputCommand()) {
            console.log(interaction.options.getSubcommand(false));
        }
        return true;
    }
}