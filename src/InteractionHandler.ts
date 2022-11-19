import type { RestrictedCommand } from "./interactions/commands/RestrictedCommand";
import type { DIH4DJS } from "./";

import path from "node:path";
import fs from "node:fs/promises";
import { RegistrationType } from './interactions/commands/application/RegistrationType';
import { ContextCommand } from "./interactions/commands/application/ContextCommand";
import { SlashCommand } from "./interactions/commands/application/SlashCommand";
import { ComponentHandler } from "./interactions/ComponentHandler";
import { CommandUtils } from "./utils/CommandUtils";
import { DIH4DJSLogger } from "./DIH4DJSLogger";
import { SmartQueue } from "./SmartQueue";
import { Pair } from "./utils/Pair";
import { ComponentIdBuilder } from "./utils/ComponentIdBuilder";
import {
    ApplicationCommand,
    ApplicationCommandType,
    BaseInteraction, 
    ButtonInteraction, 
    ChatInputCommandInteraction, 
    Collection, 
    Guild, 
    GuildMember, 
    MessageContextMenuCommandInteraction, 
    ModalSubmitInteraction, 
    REST, 
    Routes, 
    SelectMenuInteraction, 
    SlashCommandSubcommandBuilder, 
    SlashCommandSubcommandGroupBuilder, 
    UserContextMenuCommandInteraction 
} from "discord.js";

export class InteractionHandler {
    private static RETRIVED_COMMANDS: Collection<string, ApplicationCommand> = new Collection();

    public slashCommands: SlashCommand[];
    public contextCommands: ContextCommand<any>[];

    /**
     * An index of all {@link SlashCommand.Command}s
     */
    private slashCommandIndex: Collection<string, SlashCommand>;

    /**
     * An index of all {@link SlashCommand.Subcommand}s
     */
    private subcommandIndex: Collection<string, SlashCommand.Subcommand>;

    /**
     * An index of all {@link ContextCommand.Message}s
     */
    private messageContextIndex: Collection<string, ContextCommand.Message>;

    /**
     * An index of all {@link ContextCommand.User}s
     */
    private userContextIndex: Collection<string, ContextCommand.User>;

    /**
     * An index of all {@link ComponentHandler}s.
     */
    private buttonHandlers: Collection<string, ComponentHandler>;
    private selectMenuHandlers: Collection<string, ComponentHandler>;
    private modalHandlers: Collection<string, ComponentHandler>;

    private dih4djs: DIH4DJS;

    /**
     * Constructs a new {@link InteractionManager}
     * @param client The {@link Lorra} instance
     */
    constructor(dih4djs: DIH4DJS) {
        this.dih4djs = dih4djs;

        this.slashCommands = Array.of();
        this.contextCommands = Array.of();

        this.findCommandsAndComponents(dih4djs.getPackages());

        this.slashCommandIndex = new Collection();
        this.subcommandIndex = new Collection();
        this.messageContextIndex = new Collection();
        this.userContextIndex = new Collection();

        this.buttonHandlers = new Collection();
        this.selectMenuHandlers = new Collection();
        this.modalHandlers = new Collection();
    }

    /**
     * Register all commands to the DiscordAPI
     * (*) SlashCommands
     * (*) ContextCommands
     */
    public registerInteractions() {
        const data = new Pair(this.getSlashCommands(), this.getContextCommands());
        if(!this.dih4djs.getClient().token && !this.dih4djs.getClient().application) return;
        const token = this.dih4djs.getClient().token!;
        const appId = this.dih4djs.getClient().application!.id!;
        const rest = new REST({ version: '10' }).setToken(token);
        this.dih4djs.getClient().guilds.cache.forEach(async (guild) => {
            const existing = guild.commands.cache;
            var guildData: Pair<SlashCommand[], ContextCommand<any>[]>;
            if(guild.id === this.dih4djs.testingGuild())
                guildData = CommandUtils.filterByType(data, RegistrationType.Private);
            else guildData = CommandUtils.filterByType(data, RegistrationType.Guild);
            existing.forEach((e) => this.cacheCommand(e));
            guildData = new SmartQueue(guildData.getFirst(), guildData.getSecond()).checkGuild(Array.from(existing.values()), guild);
            if(guildData.getFirst() || guildData.getSecond()) {
                this.upsertGuildCommands(guild, guildData.getFirst(), guildData.getSecond());
            }
        });
        rest.get(Routes.applicationCommands(appId)).then((existing: any) => {
            var globalData = CommandUtils.filterByType(data, RegistrationType.Global)
            existing.forEach((e: any) => this.cacheCommand((e as ApplicationCommand)));
            globalData = new SmartQueue(globalData.getFirst(), globalData.getSecond()).checkGlobal(existing);
            if(globalData.getFirst() || globalData.getSecond()) {
                this.upsertGlobalCommands(globalData.getFirst(), globalData.getSecond())
                DIH4DJSLogger.info("Queued %s global command(s): %ss"
                    .replace("%s", `${globalData.getFirst().length + globalData.getSecond().length}`)
                    .replace("%ss", CommandUtils.getNames(globalData.getSecond(), globalData.getFirst())))
            }
        });
    }

    private async upsertGuildCommands(guild: Guild, slashCommands: SlashCommand[], contextCommands: ContextCommand<any>[]) {
        const token = this.dih4djs.getClient().token!;
        const appId = this.dih4djs.getClient().application!.id!;
        const rest = new REST({ version: '10' }).setToken(token);
        var commands: any[] = Array.of();
        slashCommands.map(c => commands.push(c.getCommandData().toJSON()));
        contextCommands.map(c => commands.push(c.getCommandData().toJSON()));
        await rest.put(Routes.applicationGuildCommands(appId, guild.id), { body: commands })
            .catch((reason) => DIH4DJSLogger.warn(reason));
    }

    private async upsertGlobalCommands(slashCommands: SlashCommand[], contextCommands: ContextCommand<any>[]) {
        const token = this.dih4djs.getClient().token!;
        const appId = this.dih4djs.getClient().application!.id!;
        const rest = new REST({ version: '10' }).setToken(token);
        var commands: any[] = Array.of();
        slashCommands.map(c => commands.push(c.getCommandData().toJSON()));
        contextCommands.map(c => commands.push(c.getCommandData().toJSON()));
        await rest.put(Routes.applicationCommands(appId), { body: commands })
            .catch((reason) => DIH4DJSLogger.warn(reason));
    }

    private cacheCommand(command: ApplicationCommand) {
        InteractionHandler.RETRIVED_COMMANDS.set(command.name, command);
    }

    public static getRetrievedCommands() {
        return this.RETRIVED_COMMANDS;
    }

    /**
     * Find and Register all {@link SlashCommand}s
     * @param dir Location of {@link SlashCommand}s
     */
    private findCommandsAndComponents(packages: string[]): void {
        packages.forEach(async (pkg) => {
            this.registerCommandsAndOrComponenets(pkg);
        });
    }

    private async registerCommandsAndOrComponenets(pkg: string) {
        const basePath = path.join(CommandUtils.getRootPath(), pkg);
        const files = await fs.readdir(basePath);
        for (const file of files) {
            const filePath = path.join(basePath, file);
            const stat = await fs.lstat(filePath);
            if (stat.isDirectory()) this.registerCommandsAndOrComponenets(path.join(pkg, file));
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                try {
                    const { default: Command } = await import(filePath);
                    const command = new Command();
                    if(command instanceof SlashCommand) 
                        this.slashCommands.push(command);
                    if(command instanceof ContextCommand) 
                        this.contextCommands.push(command);
                    if(command instanceof ComponentHandler)
                        this.putComponentHandlers(command);
                } catch (err) {DIH4DJSLogger.error(err)}
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
                .forEach((g) => commandData.addSubcommandGroup(g));
        }
        if(command.getSubcommands() !== null && command.getSubcommands().length !== 0) {
            this.getSubcommandData(command, command.getSubcommands())
                .forEach((s) => commandData.addSubcommand(s));
        }
        this.slashCommandIndex.set(CommandUtils.buildCommandPath(commandData.name), command);
        DIH4DJSLogger.info("Registered command: /%s (%ss)".replace("%s", command.getCommandData().name).replace("%ss", command.getRegistrationType().toString()));
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
                DIH4DJSLogger.info("Registered command: /%s (%ss)".replace("%s", command.getCommandData().name).replace("%ss", command.getRegistrationType().toString()));
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
        DIH4DJSLogger.info("Registered context command: %s (%ss)".replace("%s", data.name).replace("%ss", command.getRegistrationType().toString()))
        return data;
    }

    /**
     * Register all {@link ComponentHandler}s
     * @param handler {@link ComponentHandler} instance
     * @returns 
     */
    private putComponentHandlers(handler?: ComponentHandler): void {
        if(handler === null) return;
        handler?.getButtonIds().forEach(s => this.buttonHandlers.set(s, handler));
        handler?.getSelectMenuIds().forEach(s => this.selectMenuHandlers.set(s, handler));
        handler?.getModalIds().forEach(s => this.modalHandlers.set(s, handler));
    }

    /**
     * Handle all {@link ChatInputCommandInteraction}s
     * @param interaction SlashCommand interaction response
     */
    public handleSlashCommand(interaction: ChatInputCommandInteraction) {
        var slashcommand = this.slashCommandIndex.get(interaction.commandName)!;
        var subcommand = this.subcommandIndex.get(interaction.commandName)!;
        if(slashcommand === null && subcommand === null
                || slashcommand === undefined && subcommand === undefined) {
            throw new Error("Slash command %s is not registered.".replace("%s", interaction.commandName));
        } else {
            if(slashcommand === null) {
                var base = subcommand.getParent()!;
                if(this.passesRequirements(interaction, base) && this.passesRequirements(interaction, subcommand)) {
                    subcommand?.execute(this.dih4djs.getClient(), interaction);
                }
            } else if(this.passesRequirements(interaction, slashcommand)) {
                slashcommand.execute(this.dih4djs.getClient(), interaction);
            }
        }
    }

    /**
     * Handle all {@link UserContextMenuCommandInteraction}s
     * @param interaction UserContext interaction response
     */
    public handleUserContextCommand(interaction: UserContextMenuCommandInteraction) {
        var context = this.userContextIndex.get(interaction.commandName)!;
        if(context === null || context === undefined) {
            throw new Error("UserContext command %s is not registered.".replace("%s", interaction.commandName));
        } else {
            if(this.passesRequirements(interaction, context)) {
                context.execute(this.dih4djs.getClient(), interaction);
            }
        }
    }

    /**
     * Handle all {@link MessageContextMenuCommandInteraction}s
     * @param interaction MessageContext interaction response
     */
    public handleMessageContextCommand(interaction: MessageContextMenuCommandInteraction) {
        var context = this.messageContextIndex.get(interaction.commandName)!;
        if(context === null || context === undefined) {
            throw new Error("MessageContext command %s is not registered.".replace("%s", interaction.commandName));
        } else {
            if(this.passesRequirements(interaction, context)) {
                context.execute(this.dih4djs.getClient(), interaction);
            }
        }
    }

    /**
     * Handle all {@link ButtonInteraction}s
     * @param interaction Button interaction response
     */
    public handleButton(interaction: ButtonInteraction) {
        var component = this.buttonHandlers.get(ComponentIdBuilder.split(interaction.customId)[0]!);
        if(component === null || component === undefined) {
            DIH4DJSLogger.warn("Button with the id %s could not be found.".replace("%s", interaction.customId))
        } else {
            component.handleButton(interaction);
        }
    }

    /**
     * Handle all {@link SelectMenuInteraction}s
     * @param interaction SelectMenu interaction response
     */
    public handleSelectMenu(interaction: SelectMenuInteraction) {
        var component = this.selectMenuHandlers.get(ComponentIdBuilder.split(interaction.customId)[0]!);
        if(component === null || component === undefined) {
            DIH4DJSLogger.warn("Select menu with the id %id% could not be found.".replace("%id%", interaction.customId));
        } else {
            component.handleSelectMenu(interaction);
        }
    }

    /**
     * Handle all {@link ModalSubmitInteraction}s
     * @param interaction Modal interaction response
     */
    public handleModal(interaction: ModalSubmitInteraction) {
        var modal = this.modalHandlers.get(ComponentIdBuilder.split(interaction.customId)[0]!);
        if(modal === null || modal === undefined) {
            DIH4DJSLogger.warn("Modal with the id %id% could not be found.".replace("%id%", interaction.customId));
        } else {
            modal.handleModalSubmit(interaction);
        }
    }

    /**
     * Checks if the {@link BaseInteraction} passes the {@link RestrictedCommand}
     * requirements
     * @param interaction The {@link BaseInteraction}
     * @param command The {@link RestrictedCommand} which contains the (possible) restrictions.
     * @returns Whether the event was fired
     */
    private passesRequirements(interaction: BaseInteraction, command: RestrictedCommand) {
        var userId = interaction.user.id;
        var userIds = command.getRequiredUsers();
        var roleIds = command.getRequiredRoles();
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
        if(command.getCommandCooldown() !== 0) {
            if(command.hasCooldown(userId)) {
                return false;
            } else {
                command.applyCooldown(userId, (Date.now() + command.getCommandCooldown()));
            }
        }
        return true;
    }
}