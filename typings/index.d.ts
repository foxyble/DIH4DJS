import { 
    AnySelectMenuInteraction,
    ApplicationCommand,
    ApplicationCommandOptionType,
    BaseInteraction,
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    ChatInputCommandInteraction,
    Client,
    Collection,
    ContextMenuCommandBuilder,
    ContextMenuCommandType,
    Guild,
    MentionableSelectMenuInteraction,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder,
    StringSelectMenuInteraction,
    UserContextMenuCommandInteraction,
    UserSelectMenuInteraction
} from 'discord.js';

//#region Classes
export type DIHOptions = {
    packages?: string|string[];
    defaultRegistrationType?: RegistrationType;
    cooldownNotification: boolean;
    testingServer?: string;
    logging?: LoggerOptions;
    registerOnReady?: boolean;
}
export type LoggerOptions = {enabled?: boolean;blockedTypes?: DIH4DJSLogger.Type[];}

export class Options extends null {
    public static validateOptions(options: DIHOptions): DIHOptions;
    private static createDefault(): DIHOptions;
}

export class DIH4DJS {
    private static _defaultRegistrationType: RegistrationType;

    constructor(client: Client, options?: DIHOptions);
    public options: DIHOptions;
    public client: Client;
    public componentManager: ComponentManager;
    public interactionManager: InteractionManager;

    public registerInteractions(): void;
    public addSlashCommands(...commands: SlashCommand[]): void;
    public addContextCommands(...commands: ContextCommand<any>[]): void;

    public get packages(): string[];
    public get isRegisterOnReady(): boolean;
    public get testingServer(): string[];
    public get isCooldownNotification(): boolean;

    public static get defaultRegistrationType(): RegistrationType;
    public static set defaultRegistrationType(type: RegistrationType);

    private registerEventListeners(): void;
}

export class DIH4DJSLogger {
    public static blockedLogTypes: DIH4DJSLogger.Type[];

    private static log(message: any, type: DIH4DJSLogger.Type, level: DIH4DJSLogger.Level): void;

    public static info(msg: any, type?: DIH4DJSLogger.Type): void;
    public static warn(msg: any, type?: DIH4DJSLogger.Type): void;
    public static error(msg: any): void;
    public static debug(msg: any, type?: DIH4DJSLogger.Type): void;
    public static trace(msg: any, type?: DIH4DJSLogger.Type): void;
}

export abstract class ActionListener {
    constructor(event: string);

    abstract execute(...args: any): Promise<void>;
}

export type ComponentHandlerOptions = {
    handledButtonIds?: string[];
    handledSelectMenuIds?: string[];
    handledModalIds?: string[];
}

export abstract class ComponentHandler {
    constructor(options: ComponentHandlerOptions);
    public options: ComponentHandlerOptions;

    public get handledButtons(): string[];
    public handleButton(interaction: ButtonInteraction): void;

    public get handledSelectMenus(): string[];
    public handleSelectMenu(interaction: SelectMenuInteraction): void;

    public get handledModals(): string[];
    public handleModal(interaction: ModalSubmitInteraction): void;
}

export type CommandOptions = {
    registrationType?: RegistrationType;
    requiredGuilds?: string[];
    requiredUsers?: string[];
    requiredRoles?: string[];
    permissions?: bigint[];
    cooldown?: number;
    components?: ComponentHandlerOptions;
}

export abstract class RestrictedCommand extends ComponentHandler {
    private COOLDOWN_CACHE: Collection<string, RestrictedCommand.Cooldown>;
    constructor(options: CommandOptions);

    public get registrationType(): RegistrationType;
    public get requiredGuilds(): string[];
    public get requiredUsers(): string[];
    public get requiredRoles(): string[];
    public get peermissions(): bigint[];
    public get cooldown(): number;

    public applyCooldown(userId: string, nextUse: number): void;
    private retrieveCooldown(userId: string): RestrictedCommand.Cooldown;
    public hasCooldown(userId: string): boolean;

    private static createDefault(): CommandOptions;
}

export abstract class BaseApplicationCommand<E, T> extends RestrictedCommand implements ExecutableCommand<E> {
    public data: any;
    constructor(data: any, options?: CommandOptions);
    public setCommandData(data: T): void;
    public execute(client: Client<boolean>, interaction: E): void;
}

export class Commands {
    public static slash(name: string, description: string, type?: ApplicationCommandOptionType): SlashCommandBuilder
    | SlashCommandSubcommandBuilder 
    | SlashCommandSubcommandGroupBuilder;

    public static context(type: ContextMenuCommandType, name: string): ContextMenuCommandBuilder;
    public static message(name: string): ContextMenuCommandBuilder;
    public static user(name: string): ContextMenuCommandBuilder;
}

export abstract class ContextCommand<E> extends BaseApplicationCommand<E, ContextMenuCommandBuilder> {}

export abstract class SlashCommand extends BaseApplicationCommand<ChatInputCommandInteraction, SlashCommandBuilder> {
    private subcommands: SlashCommand.Subcommand[];
    private subcommandGroups: SlashCommand.SubcommandGroup[];

    public addSubcommands(...commands: SlashCommand.Subcommand[]): void;
    public addSubcommandGroups(...groups: SlashCommand.SubcommandGroup[]): void;

    public asCommand(): ApplicationCommand;
}

export class CommandUtils {
    public static buildCommandPath(...args: string[]): string;
    public static filterByType(pair: Pair<SlashCommand[], ContextCommand<any>[]>, type: RegistrationType): Pair<SlashCommand[], ContextCommand<any>[]>;
    public static getNames(command: ContextCommand<any>[], slash: SlashCommand[]): string;
}

export class Pair<F, S> {
    public first: F;
    public second: S;
    constructor(first: F, second: S);
}

export class ComponentIdBuilder {
    static seperator: string;
    public static setDefaultSeperator(seperator: string): void;
    public static build(identifier: string, ...args: string[]): string;
    public static split(id: string): string[];
}

export class ComponentManager {
    public buttonHandlers: Collection<string, ComponentHandler>;
    public selectMenuHandlers: Collection<string, ComponentHandler>;
    public modalHandlers: Collection<string, ComponentHandler>;
    private constructor();

    public putComponentHandlers(handler: ComponentHandler): void;

    public handleButton(buttonInteraction: ButtonInteraction): void;
    
    public handleStringSelect(interaction: StringSelectMenuInteraction): void;
    public handleUserSelect(interaction: UserSelectMenuInteraction): void;
    public handleChannelSelect(interaction: ChannelSelectMenuInteraction): void;
    public handleMentionableSelect(interaction: MentionableSelectMenuInteraction): void;

    public handleModal(modalInteraction: ModalSubmitInteraction): void;
}

export class InteractionManager {
    public static RETRIVED_COMMANDS: Collection<string, ApplicationCommand>;
    private dih4djs: DIH4DJS;
    public slashCommands: SlashCommand[];
    public contextCommands: ContextCommand<any>[];

    public slashCommandIndex: Collection<string, SlashCommand>;
    public subcommandIndex: Collection<string, SlashCommand.Subcommand>;
    public messageContextIndex: Collection<string, ContextCommand.Message>;
    public userContextIndex: Collection<string, ContextCommand.User>;

    constructor(dih4djs: DIH4DJS);

    public registerInteractions(): void;
    private upsertGuildCommands(guild: Guild, slashCommands: SlashCommand[], contextCommands: ContextCommand<any>[]);
    private upsertGlobalCommands(slashCommands: SlashCommand[], contextCommands: ContextCommand<any>[]): void;
    private cacheCommand(command: ApplicationCommand): void;
    private findCommandsAndComponents(packages: string[]): void;
    private registerCommandsAndOrComponents(pkg: string): void;
    public getSlashCommands(): SlashCommand[];
    private getbaseCommandData(command: SlashCommand);
    private getSubcommandGroupData(command: SlashCommand);
    private getSubcommandData(command: SlashCommand, subcommands: SlashCommand.Subcommand[], subGroupName?: string);
    private getContextCommands(): ContextCommand<any>[];
    private getContextCommandData(command: ContextCommand<any>);
    public handleSlashCommand(interaction: ChatInputCommandInteraction): void;
    public handleUserContextCommand(interaction: UserContextMenuCommandInteraction): void;
    public handleMessageContextCommand(interaction: MessageContextMenuCommandInteraction): void;
    private passesRequirements(interaction: BaseInteraction, command: RestrictedCommand): boolean;
}

export class SmartQueue {
    constructor(slashCommands: SlashCommand[], contextCommands: ContextCommand<any>[]);
    public checkGlobal(existing: ApplicationCommand[]): Pair<SlashCommand[], ContextCommand<any>[]>;
    public checkGuild(existing: ApplicationCommand[], guild: Guild): Pair<SlashCommand[], ContextCommand<any>[]>;
    private rmeoveDuplicates(existing: ApplicationCommand[], guild?: Guild): Pair<SlashCommand[], ContextCommand<any>[]>;
}

export class DIHError extends Error {
    constructor(message: string);
}
// #endregion

//#region Namespaces
export namespace SlashCommand {
    export abstract class Subcommand extends BaseApplicationCommand<ChatInputCommandInteraction, SlashCommandSubcommandBuilder> {
        private _parent: SlashCommand|null;
        public set parent(parent: SlashCommand);
        public asSubcommand(): ApplicationCommand|null;
    }
    export class SubcommandGroup extends BaseApplicationCommand<ChatInputCommandInteraction, SlashCommandSubcommandGroupBuilder> {
        public subcommands: Subcommand[];
        private constructor(data: SlashCommandSubcommandGroupBuilder, ...commands: Subcommand[]);
        public static of(data: SlashCommandSubcommandGroupBuilder, ...subcommands: Subcommand[]): SubcommandGroup;
    }
}

export namespace ContextCommand {
    export abstract class Message extends ContextCommand<MessageContextMenuCommandInteraction> {}
    export abstract class User extends ContextCommand<UserContextMenuCommandInteraction> {}
}

export namespace RestrictedCommand {
    export class Cooldown {
        constructor(lastUse: number, nextUse: number);
        public lastUse: number;
        public nextUse: number;
    }
}

export namespace DIH4DJSLogger {
    export enum Type {
        Info,
        Error,
        Debug,
        Warn,
        Trace,
        CommandQueued,
        SlashCommandRegistered,
        SlashCommandSkipped,
        SlashCommandNotFound,
        ContextCommandRegistered,
        ContextCommandSkipped,
        ContextCommandNotFound,
        SmartQueue,
        SmartQueueIgnored,
        SmartQueueDeleteUnknown,
        SmartQueueIgnoreUnknown,
        ButtonNotFound,
        SelectMenuNotFound,
        ModalNotFound,
        ActionRegistered
    }
    export enum Level {
        Info = "INFO",
        Error = "ERROR",
        Trace = "TRACE",
        Debug = "DEBUG",
        Warn = "WARN"
    }
}
//#endregion

//#region Interfaces
export interface ExecutableCommand<E> {
    execute(client: Client, interaction: E): void;
}
//#endregion

//#region Enums
export enum RegistrationType {Global = "Global",Testing = "Testing",Guild = "Guild"}
//#endregion

//#region Functions
export function getRootPath(): string;
//#endregion