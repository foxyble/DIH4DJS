import type RestrictedCommand from "./interactions/commands/RestrictedCommand";
import { ContextCommand } from "./interactions/commands/application/ContextCommand";

import path from "node:path";
import fs from "node:fs/promises";
import { SlashCommand } from "./interactions/commands/application/SlashCommand";
import CommandUtils from "./utils/CommandUtils";
import { 
    ApplicationCommand,
    BaseInteraction, 
    ChatInputCommandInteraction, 
    Collection, 
    GuildMember, 
    MessageContextMenuCommandInteraction, 
    REST, 
    Routes, 
    SlashCommandSubcommandBuilder, 
    SlashCommandSubcommandGroupBuilder, 
    UserContextMenuCommandInteraction 
} from "discord.js";
import type DIH4DJS from ".";

export default class InteractionHandler {
    private static RETRIVED_COMMANDS: Collection<string, ApplicationCommand>;

    static {
        this.RETRIVED_COMMANDS = new Collection();
    }

    private slashCommands: SlashCommand[];
    private contextCommands: ContextCommand<any>[];

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

    private dih4djs: DIH4DJS;

    /**
     * Constructs a new {@link InteractionManager}
     * @param client The {@link Lorra} instance
     */
    constructor(dih4djs: DIH4DJS) {
        this.dih4djs = dih4djs;

        this.slashCommands = Array.of();
        this.contextCommands = Array.of();

        this.findCommandsAndComponents(dih4djs.getPackageDir());

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
        const slashCommands = this.getSlashCommands();
        slashCommands.forEach((cmd) => cmd);
        if(this.dih4djs.getClient().token && this.dih4djs.getClient().application) return;
        const token = this.dih4djs.getClient().token!;
        const appId = this.dih4djs.getClient().application!.id!;
        const rest = new REST({ version: '10' }).setToken(token);
        rest.get(Routes.applicationCommands(appId)).then((existing) => {
            console.log(existing);
        });
    }

    // private cacheCommand(command: ApplicationCommand) {
    //     InteractionHandler.RETRIVED_COMMANDS.set(command.name, command);
    // }

    public static getRetrievedCommands() {
        return this.RETRIVED_COMMANDS;
    }

    /**
     * Find and Register all {@link SlashCommand}s
     * @param dir Location of {@link SlashCommand}s
     */
    private async findCommandsAndComponents(pkg: string = ""): Promise<void> {
        const files = await fs.readdir(pkg);
        for (const file of files) {
            const filePath = path.join(pkg, file);
            const stat = await fs.lstat(filePath);
            if (stat.isDirectory()) this.findCommandsAndComponents(path.join(pkg, file));
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                const { default: Command } = await import(filePath);
                const command = new Command();
                switch(true) {
                    case command instanceof SlashCommand:
                        this.slashCommands.push(command);
                        break;
                    case command instanceof ContextCommand:
                        this.contextCommands.push(command);
                        break;
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
        if(command.getCommandData() === null) null;
        var commandData = command.getCommandData();
        if(command.addSubcommandGroups() !== null && command.getSubcommandGroups().length !== 0) {
            this.getSubcommandGroupData(command)
                .forEach((g) => commandData.addSubcommandGroup(g));
        }
        if(command.getSubcommands() !== null && command.getSubcommands().length !== 0) {
            this.getSubcommandData(command, command.getSubcommands())
                .forEach((s) => commandData.addSubcommand(s));
        }
        if(command.getSubcommandGroups() !== null && command.getSubcommandGroups().length !== 0
                && command.getSubcommands() !== null && command.getSubcommands().length !== 0) {
            this.slashCommandIndex.set(CommandUtils.buildCommandPath(commandData.name), command);
            // Info
        }
        return commandData;
    }

    private getSubcommandGroupData(command: SlashCommand) {
        var groupDataList: SlashCommandSubcommandGroupBuilder[] = Array.of();
        for(const group of command.getSubcommandGroups()) {
            if(group !== null) {
                var groupData = group.getData();
                if(groupData === null) {
                    // Warn
                    continue;
                }
                if(group.getSubcommands() === null || group.getSubcommands().length === 0) {
                    // Warn
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
                    // Warn
                    continue;
                }
                var commandPath: string;
                if(subGroupName === null || subGroupName === undefined) {
                    commandPath = CommandUtils.buildCommandPath(command.getCommandData().name, subcommand.getCommandData().name);
                } else {
                    commandPath = CommandUtils.buildCommandPath(command.getCommandData().name, subGroupName, subcommand.getCommandData().name);
                }
                this.subcommandIndex.set(commandPath, subcommand);
                // Info
                subDataList.push(subcommand.getCommandData());
            }
        }
        return subDataList;
    }





    // /**
    //  * Finds and Registers all {@link ComponentHandler}s
    //  * @param dir Location of {@link ComponentHandler}s
    //  */
    // private async findInteractionHandlers(dir: string = "../systems/"): Promise<void> {
    //     const basePath = path.join(__dirname, dir);
    //     const files = await fs.readdir(basePath);
    //     for (const file of files) {
    //         const filePath = path.join(basePath, file);
    //         const stat = await fs.lstat(filePath);
    //         if (stat.isDirectory()) this.findInteractionHandlers(path.join(dir, file));
    //         if (file.endsWith('.js') || file.endsWith('.ts')) {
    //             const { default: Handler } = await import(filePath);
    //             const handler = new Handler();
    //             if(handler instanceof ComponentHandler) {
    //                 this.putComponentHandlers(handler);
    //             }
    //         }
    //     }
    // }

    // /**
    //  * Register all {@link ComponentHandler}s
    //  * @param handler {@link ComponentHandler} instance
    //  * @returns 
    //  */
    // private putComponentHandlers(handler?: ComponentHandler<any>): void {
    //     if(handler === null) return;
    //     handler?.getHandleButtonIds().forEach(s => this._handlerIndex.set(s, handler));
    //     handler?.getHandleSelectMenuIds().forEach(s => this._handlerIndex.set(s, handler));
    //     handler?.getHandleModalIds().forEach(s => this._handlerIndex.set(s, handler));
    // }

    /**
     * Handle all {@link ChatInputCommandInteraction}s
     * @param interaction SlashCommand interaction response
     */
    public handleSlashCommand(interaction: ChatInputCommandInteraction) {
        var slashcommand = this.slashCommandIndex.get(interaction.commandName)!;
        var subcommand = this.subcommandIndex.get(interaction.commandName)!;
        if(slashcommand === null && subcommand === null) {
            // Error
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
        if(context === null) {
            // Error
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
        if(context === null) {
            // Error
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
    // public handleButton(interaction: ButtonInteraction) {
    //     var component: ComponentHandler = this._handlerIndex.get(ComponentIdBuilder.split(interaction.customId)[0])!;
    //     if(component === null) {
    //         Bot.logger.warn("Button with the id %id% could not be found.".replace("%id%", interaction.customId))
    //     } else {
    //         component.handleButton(interaction);
    //     }
    // }

    /**
     * Handle all {@link SelectMenuInteraction}s
     * @param interaction SelectMenu interaction response
     */
    // public handleSelectMenu(interaction: SelectMenuInteraction) {
    //     var component: ComponentHandler = this._handlerIndex.get(ComponentIdBuilder.split(interaction.customId)[0])!;
    //     if(component === null) {
    //         Bot.logger.warn("Select menu with the id %id% could not be found.".replace("%id%", interaction.customId));
    //     } else {
    //         component.handleSelectMenu(interaction);
    //     }
    // }

    /**
     * Handle all {@link ModalSubmitInteraction}s
     * @param interaction Modal interaction response
     */
    // public handleModal(interaction: ModalSubmitInteraction) {
    //     var modal: ComponentHandler = this._handlerIndex.get(ComponentIdBuilder.split(interaction.customId)[0])!;
    //     if(modal === null) {
    //         Bot.logger.warn("Modal with the id %id% could not be found.".replace("%id%", interaction.customId));
    //     } else {
    //         modal.handleModal(interaction);
    //     }
    // }

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
        return true;
    }
}