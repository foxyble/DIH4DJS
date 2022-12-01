'use strict';

const { Collection } = require("discord.js");
const path = require("node:path");
const fs = require("node:fs/promises");
const RegistrationType = require("../utils/RegistrationType");
const ContextCommand = require("../structures/ContextCommand");
const SlashCommand = require("../structures/SlashCommand");
const DIH4DJS = require("../DIH4DJS");
const SmartQueue = require("../structures/SmartQueue");
const { getRootPath } = require('../utils/Util');
const Pair = require("../utils/Pair");
const CommandUtils = require("../utils/CommandUtils");
const DIH4DJSLogger = require("../DIH4DJSLogger");
const ComponentHandler = require("../structures/ComponentHandler");
const RestrictedCommand = require("../structures/RestrictedCommand");

const {
    REST,
    Routes,
    ApplicationCommandType,
    ChatInputCommandInteraction
} = require("discord.js");
const ms = require("ms");

class InteractionManager {
    static RETRIVED_COMMANDS = new Collection();

    /**
     * @param {DIH4DJS} dih4djs 
     */
    constructor(dih4djs) {
        /**
         * The DIH4DJS instance.
         * @type {DIH4DJS}
         */
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
     * 
     * @returns 
     */
    registerInteractions() {
        const data = new Pair(this.getSlashCommands(), this.getContextCommands());
        if (!this.dih4djs.client.token && !this.dih4djs.client.application)
            return;
        const token = this.dih4djs.client.token;
        const appId = this.dih4djs.client.application.id;
        const rest = new REST({ version: '10' }).setToken(token);
        this.dih4djs.client.guilds.cache.forEach(async (guild) => {
            const existing = guild.commands.cache;
            var guildData;
            if (guild.id === this.dih4djs.testingServer)
                guildData = CommandUtils.filterByType(data, RegistrationType.Private);
            else
                guildData = CommandUtils.filterByType(data, RegistrationType.Guild);
            existing.forEach((e) => this.cacheCommand(e));
            guildData = new SmartQueue(guildData.first, guildData.second).checkGuild(Array.from(existing.values()), guild);
            if (guildData.first || guildData.second) {
                this.upsertGuildCommands(guild, guildData.first, guildData.second);
            }
        });
        rest.get(Routes.applicationCommands(appId)).then((existing) => {
            var globalData = CommandUtils.filterByType(data, RegistrationType.Global);
            existing.forEach((e) => this.cacheCommand(e));
            globalData = new SmartQueue(globalData.first, globalData.second).checkGlobal(existing);
            if (globalData.first || globalData.second) {
                this.upsertGlobalCommands(globalData.first, globalData.second);
                DIH4DJSLogger.info("Queued %s global command(s): %ss".replace("%s", `${globalData.first.length + globalData.second.length}`).replace("%ss", CommandUtils.getNames(globalData.second, globalData.first)));
            }
        });
    }

    /**
     * 
     * @param {*} guild 
     * @param {*} slashCommands 
     * @param {*} contextCommands 
     */
    async upsertGuildCommands(guild, slashCommands, contextCommands) {
        const token = this.dih4djs.client.token;
        const appId = this.dih4djs.client.application.id;
        const rest = new REST({ version: '10' }).setToken(token);
        var commands = Array.of();
        slashCommands.map(c => commands.push(c.getCommandData().toJSON()));
        contextCommands.map(c => commands.push(c.getCommandData().toJSON()));
        await rest.put(Routes.applicationGuildCommands(appId, guild.id), { body: commands })
            .catch((reason) => DIH4DJSLogger_1.DIH4DJSLogger.warn(reason));
    }

    /**
     * 
     * @param {*} slashCommands 
     * @param {*} contextCommands 
     */
    async upsertGlobalCommands(slashCommands, contextCommands) {
        const token = this.dih4djs.client.token;
        const appId = this.dih4djs.client.application.id;
        const rest = new REST({ version: '10' }).setToken(token);
        var commands = Array.of();
        slashCommands.map(c => commands.push(c.data.toJSON()));
        contextCommands.map(c => commands.push(c.data.toJSON()));
        await rest.put(Routes.applicationCommands(appId), { body: commands })
            .catch((reason) => DIH4DJSLogger.warn(reason));
    }

    /**
     * 
     * @param {*} command 
     */
    cacheCommand(command) {
        InteractionManager.RETRIVED_COMMANDS.set(command.name, command);
    }

    /**
     * Find and Register all {@link SlashCommand}s
     * @param {string[]} packages Location of {@link SlashCommand}s
     */
    findCommandsAndComponents(packages) {
        packages.forEach(async (pkg) => {
            this.registerCommandsAndOrComponenets(pkg);
        });
    }

    /**
     * Loops through each file of a given package.
     * @param pkg The directory where the commands are.
     */
    async registerCommandsAndOrComponenets(pkg) {
        const basePath = path.join((0, getRootPath)(), pkg);
        const files = await fs.readdir(basePath);
        for (const file of files) {
            const filePath = path.join(basePath, file);
            const stat = await fs.lstat(filePath);
            if (stat.isDirectory()) this.registerCommandsAndOrComponenets(path.join(pkg, file));
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                const Command = require(filePath);
                const commandOrHandler = new Command();
                if (commandOrHandler instanceof SlashCommand) {
                    this.slashCommands.push(commandOrHandler);
                }
                if (commandOrHandler instanceof ContextCommand) {
                    this.contextCommands.push(commandOrHandler);
                }
                if (commandOrHandler instanceof ComponentHandler) {
                    this.dih4djs.componentManager.putComponentHandlers(commandOrHandler);
                }
            }
        }
    }

    /**
     * 
     * @returns 
     */
    getSlashCommands() {
        var commands = Array.of();
        for (const command of this.slashCommands) {
            if (command !== null) {
                var data = this.getBaseCommandData(command);
                if (data !== null) {
                    command.setCommandData(data);
                }
                commands.push(command);
            }
        }
        return commands;
    }

    /**
     * 
     * @param {*} command 
     * @returns 
     */
    getBaseCommandData(command) {
        if (command.data === null)
            return null;
        var commandData = command.data;
        if (command.subcommandGroups !== null && command.subcommandGroups.length !== 0) {
            this.getSubcommandGroupData(command)
                .forEach((g) => commandData.addSubcommandGroup(g));
        }
        if (command.subcommands !== null && command.subcommands.length !== 0) {
            this.getSubcommandData(command, command.getSubcommands())
                .forEach((s) => commandData.addSubcommand(s));
        }
        this.slashCommandIndex.set(CommandUtils.buildCommandPath(commandData.name), command);
        DIH4DJSLogger.info(`Registered command: /${command.data.name} (${command.registrationType})`, DIH4DJSLogger.Type.SlashCommandRegistered);
        return commandData;
    }

    /**
     * 
     * @param {*} command 
     * @returns 
     */
    getSubcommandGroupData(command) {
        var groupDataList = Array.of();
        for (const group of command.subcommandGroups) {
            if (group !== null) {
                var groupData = group.data;
                if (groupData === null) {
                    DIH4DJSLogger.warn("A SubcommandGroup is missing Subcommands. It will be ignored.");
                    continue;
                }
                if (group.subcommands === null || group.subcommands.length === 0) {
                    DIH4DJSLogger.warn("A SubcommandGroup is missing Subcommands. It will be ignored.");
                    continue;
                }
                this.getSubcommandData(command, group.subcommands, groupData.name)
                    .forEach((s) => groupData.addSubcommand(s));
                groupDataList.push(groupData);
            }
        }
        return groupDataList;
    }

    /**
     * 
     * @param {*} command 
     * @param {*} subcommands 
     * @param {*} subGroupName 
     * @returns 
     */
    getSubcommandData(command, subcommands, subGroupName) {
        var subDataList = Array.of();
        for (const subcommand of subcommands) {
            if (subcommand !== null) {
                if (subcommand.data === null) {
                    DIH4DJSLogger.warn("Missing SubcommandData. It will be ignored.");
                    continue;
                }
                var commandPath;
                if (subGroupName === null || subGroupName === undefined) {
                    commandPath = CommandUtils.buildCommandPath(command.getCommandData().name, subcommand.getCommandData().name);
                }
                else {
                    commandPath = CommandUtils.buildCommandPath(command.getCommandData().name, subGroupName, subcommand.getCommandData().name);
                }
                this.subcommandIndex.set(commandPath, subcommand);
                DIH4DJSLogger.info(`Registered command: /${commandPath} (${command.registrationType})`, DIH4DJSLogger.Type.SlashCommandRegistered);
                subDataList.push(subcommand.data);
            }
        }
        return subDataList;
    }

    /**
     * 
     * @returns 
     */
    getContextCommands() {
        const commands = Array.of();
        for (const context of this.contextCommands) {
            if (context !== null) {
                const data = this.getContextCommandData(context);
                if (data !== null) {
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
    getContextCommandData(command) {
        const data = command.data;
        if (data === null) {
            DIH4DJSLogger.warn("A command is getting ignored, make sure you have set CommandData for all commands.");
            return null;
        }
        if (data.type === ApplicationCommandType.Message) {
            this.messageContextIndex.set(data.name, command);
        }
        else if (data.type === ApplicationCommandType.User) {
            this.userContextIndex.set(data.name, command);
        }
        else {
            DIH4DJSLogger.error(`Invalid command type ${data.type} for Context Command! It will be ignored.`);
            return null;
        }
        DIH4DJSLogger.info(`Registered context command: ${data.name} (${command.registrationType})`, DIH4DJSLogger.Type.ContextCommandRegistered);
        return data;
    }

    /**
     * Handle all {@link ChatInputCommandInteraction}s
     * @param {ChatInputCommandInteraction} interaction SlashCommand interaction response.
     * @since v1.0
     */
    handleSlashCommand(interaction) {
        var slashcommand = this.slashCommandIndex.get(interaction.commandName);
        if (slashcommand === null || slashcommand === undefined) {
            DIH4DJSLogger.warn(`Couldn't find slashcommand ${interaction.commandName}.`, DIH4DJSLogger.Type.SlashCommandNotFound);
        } else {
            var subcommand = this.subcommandIndex.get(CommandUtils.buildCommandPath(interaction.commandName, interaction.options.getSubcommand(false)));
            if (this.passesRequirements(interaction, slashcommand)) {
                return slashcommand.execute(this.dih4djs.client, interaction);
            } else if (subcommand !== null && subcommand !== undefined) {
                if (interaction.options.getSubcommand(false) !== null && this.passesRequirements(interaction, subcommand)
                    && this.passesRequirements(interaction, slashcommand)) {
                    return subcommand.execute(this.dih4djs.client, interaction);
                };
            }
        }
    }

    /**
     * Handle all {@link UserContextMenuCommandInteraction}s
     * @param interaction UserContext interaction response.
     * @since v1.0
     */
    handleUserContextCommand(interaction) {
        var context = this.userContextIndex.get(interaction.commandName);
        if (context === null || context === undefined) {
            throw new Error("UserContext command %s is not registered.".replace("%s", interaction.commandName));
        }
        else {
            if (this.passesRequirements(interaction, context)) {
                context.execute(this.dih4djs.client, interaction);
            }
        }
    }

    /**
     * Handle all {@link MessageContextMenuCommandInteraction}s
     * @param interaction MessageContext interaction response.
     */
    handleMessageContextCommand(interaction) {
        var context = this.messageContextIndex.get(interaction.commandName);
        if (context === null || context === undefined) {
            throw new Error("MessageContext command %s is not registered.".replace("%s", interaction.commandName));
        }
        else {
            if (this.passesRequirements(interaction, context)) {
                context.execute(this.dih4djs.client, interaction);
            }
        }
    }

    /**
     * Checks if the {@link BaseInteraction} passes the {@link RestrictedCommand}
     * requirements
     * @param {BaseInteraction} interaction
     * @param {RestrictedCommand} command 
     * @returns Whether the event was fired
     */
    passesRequirements(interaction, command) {
        var userId = interaction.user.id;
        /**@type {string[]} */
        var userIds = command.requiredGuilds;
        /**@type {string[]} */
        var roleIds = command.requiredRoles;
        if (userIds !== null && userIds.length !== 0 && !roleIds.includes(userId)) {
            return false;
        }
        if (interaction.guild && interaction.member !== null) {
            var member = interaction.member;
            if (roleIds !== null && roleIds.length !== 0 && !member.roles.cache.find(r => roleIds.includes(r.id))) {
                return false;
            }
        }
        // Check if the command has enabled some sort of cooldown
        if (command.cooldown > 0) {
            if (command.hasCooldown(userId)) {
                if (this.dih4djs.isCooldownNotification) {
                    const c = ms(command.cooldown - (Date.now() - command.COOLDOWN_CACHE.get(userId).lastUse));
                    interaction.reply({ content: `Try again in ${c}s`, ephemeral: true })
                }
                return false;
            } else {
                command.applyCooldown(userId, (Date.now() + command.cooldown));
            }
        }
        return true;
    }
}

module.exports = InteractionManager;