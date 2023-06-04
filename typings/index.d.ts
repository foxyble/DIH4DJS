/*
 * Regions are split based on directories.
 * Each region will hold classes as well a namespaces while functions and or 
 * types will be at the top of the file.
 */

import { Client, ClientEvents, ShardingManager } from "discord.js";
import { EventEmitter } from 'node:events';

export type DIH4DJSOptions = {
    strategy: { new<T extends Strategy>(): any };
    packages: string|string[];
}

export class DIH4DJS extends EventEmitter {
    public options: DIH4DJSOptions;
    public static defaultRegistrationType: RegistrationType;
    public constructor(options: DIH4DJSOptions);
    public static setDefaultRegistrationType(type: RegistrationType): void;
    private _validateOptions(): void;
}

// #region - structures

export abstract class ActionListener {
    public constructor(action: string, once: boolean);
    abstract execute(dih4djs: DIH4DJS, client: Client, ...args: ClientEvents[]): void;
}

export interface ExecutableCommand<E> {
    execute(client: Client, event: E): void|Promise<void>;
}

export class BaseApplicationCommand<T, E> implements ExecutableCommand<E> {
    public data: T;
    public execute(client: Client<boolean>, event: E): void|Promise<void>;
}

export abstract class Strategy {
    public setToken(token: string): void;
    public addListener(clazz: { new<T extends ActionListener>(): any }): void;
    public addListeners(directory: string): void;
}

export class ClientStrategy extends Strategy {
    public static build(client: Client, token?: string): ClientStrategy;
    public setClient(client: Client): void;
}

export class ShardingStrategy extends Strategy {
    public static build(shardingManager: ShardingManager): ShardingStrategy;
    public setManager(shardingManager: ShardingManager): void;
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