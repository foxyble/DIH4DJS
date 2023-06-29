/*
 * Regions are split based on directories.
 * Each region will hold classes as well a namespaces while functions and or 
 * types will be at the top of the file.
 */
import { EventEmitter } from 'node:events';
import { 
    ChatInputCommandInteraction, 
    Client, 
    ClientEvents, 
    ContextMenuCommandBuilder, 
    Guild, 
    MessageContextMenuCommandInteraction, 
    REST, 
    ShardingManager, 
    SlashCommandBuilder, 
    SlashCommandSubcommandBuilder, 
    SlashCommandSubcommandGroupBuilder, 
    UserContextMenuCommandInteraction 
} from "discord.js";

export type DIH4DJSOptions = {
    strategy: { new<T extends Strategy>(): any };
    packages: string|string[];
}
export type CommandOptions = {
    cooldown: number;
    permissions: bigint[];
}

export class DIH4DJS extends EventEmitter {
    public options: DIH4DJSOptions;
    public static defaultRegistrationType: RegistrationType;
    public constructor(options: DIH4DJSOptions);
    public static setDefaultRegistrationType(type: RegistrationType): void;
    private _validateOptions(): void;
}

export class QueueManager {
    public dih4djs: DIH4DJS;
    public rest: REST;
    public upsert(slashcommands: SlashCommand[], contextcommands: ContextCommand<any>[], guild?: Guild): Promise<unknown>;
    public fetchBotUser(): Promise<unkown>;
    public fetchCommands(): Promise<unknown>;
}

// #region - structures

export abstract class ActionListener {
    public constructor(action: string, once: boolean);
    abstract execute(dih4djs: DIH4DJS, client: Client, ...args: ClientEvents[]): void;
}

export interface ExecutableCommand<E> {
    execute(client: Client, event: E): void|Promise<void>;
}

export abstract class Strategy {
    public setToken(token: string): void;
    public addListener(clazz: { new<T extends ActionListener>(): any }): void;
    public addListeners(directory: string): void;
}

export class BaseApplicationCommand<T, E> implements ExecutableCommand<E> {
    public data: T;
    public constructor(data: T, options: CommandOptions);
    public setCommandData(newData: T): void;
    public execute(client: Client<boolean>, event: E): void|Promise<void>;
}

export class ClientStrategy extends Strategy {
    public static build(client: Client, token?: string): ClientStrategy;
    public setClient(client: Client): void;
}

export abstract class ContextCommand<E> extends BaseApplicationCommand<ContextMenuCommandBuilder, E> {}
export namespace ContextCommand {
    export abstract class User extends ContextCommand<UserContextMenuCommandInteraction> {}
    export abstract class Message extends ContextCommand<MessageContextMenuCommandInteraction> {}
}

export class RestrictedCommand {
    public constructor(options);
    private _validateOptions(): void;
}

export class ShardingStrategy extends Strategy {
    public static build(shardingManager: ShardingManager): ShardingStrategy;
    public setManager(shardingManager: ShardingManager): void;
}

export abstract class SlashCommand extends BaseApplicationCommand<SlashCommandBuilder, ChatInputCommandInteraction> {
    public subcommands: any[];
    public subcommandGroups: any[];
    public addSubcommands(...commands: any[]): void;
    public addSubcommandGroups(...groups: any[]): void;
}
export namespace SlashCommand {
    export abstract class Subcommand extends BaseApplicationCommand<SlashCommandSubcommandBuilder, ChatInputCommandInteraction> {
        public parent: SlashCommand;
        public setParent(parent: SlashCommand): void;
    }
    export abstract class SubcommandGroup extends BaseApplicationCommand<SlashCommandSubcommandGroupBuilder, ChatInputCommandInteraction> {
        public subcommands: SlashCommand.Subcommand[];
        public constructor(data: CommandOptions, subcommands: SlashCommand.Subcommand[]);
        public static of(data: CommandOptions, ...subcommands: SlashCommand.Subcommand[]): SlashCommand.SubcommandGroup;
    }
}

//#endregion

// #region - util

export class ClassWalker {
    public packageName: string;
    public constructor(pkg: string);
    public getAllClasses(useModule: boolean): Promise<Set<any>>;
    private walk0(pkg: string): Promise<Set<any>>;
}

export class Options {
    static createDefault(): DIH4DJSOptions;
}

export class Pair<F, S> {
    public first: F;
    public second: S;
    public constructor(first: F, second: S);
}

export enum RegistrationType {
    Guild,
    Global
}

//#endregion