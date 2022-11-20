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
import path from 'node:path';
import fs from 'fs';
import { Client, Events } from "discord.js";
import type { ContextCommand } from "./structures/ContextCommand";
import type { SlashCommand } from "./structures/SlashCommand";
import { ComponentManager } from "./managers/ComponentManager";
import { InteractionManager } from "./managers/InteractionManager";
import { DIH4DJSOptions, DIHOptions } from "./util/DIH4DJSOptions";
import { RegistrationType } from "./util/RegistrationType";
import EventListener from './structures/EventListener';

/**
 * Main class
 * @since v1.1
 */
export class DIH4DJS {
    private static _registrationType: RegistrationType = RegistrationType.Global;

    private _client: Client;
    private _interactionManager: InteractionManager;
    private _componentManager: ComponentManager;

    private options: DIHOptions;

    constructor(client: Client, options?: DIHOptions) {
        this._client = client;

        /**
         * DIH4DJS Options
         */
        const validOptions = DIH4DJSOptions.validateOptions(options!);
        this.options = validOptions;

        /**
         * Creates new instance of {@link InteractionManager}
         */
        this._interactionManager = new InteractionManager(this);

        /**
         * Creates a new instace of {@link ComponentManager}
         */
        this._componentManager = new ComponentManager();

        /**
         * Registers in-app listeners.
         */
        this.registerEventListeners();
    }

    /**
     * Manually run's {@link InteractionManager#registerInteractions}.
     */
    registerInteractions() {
        this._interactionManager.registerInteractions();
    }

    /**
     * Manually register {@link SlashCommand}s.
     * @param commands An array of commands to register
     */
    addSlashCommands(...commands: SlashCommand[]) {
        commands.forEach((c) => this._interactionManager.slashCommands.push(c));
    }

    /**
     * Manually register {@link ContextCommand}s.
     * @param commands An array of commands to register
     */
    addContextCommands(...commands: ContextCommand<any>[]) {
        commands.forEach((c) => this._interactionManager.contextCommands.push(c));
    }

    /** The discord.js client. */
    get client(): Client { return this._client; }

    /** The directories where the commands are held. */
    get packages(): string[] { return this.options.packages!; }

    /** True if commands should register on ready, else false. */
    get isRegisterOnReady(): boolean { return this.options.registerOnReady!; }

    /** The guild id for the test server */
    get testingServer(): string { return this.options.testingServer!; }

    /** The {@link InteractionManager} instance. */
    get interactionManager() { return this._interactionManager; }

    /** The {@link ComponentManager} instance. */
    get componentManager() { return this._componentManager; }


    /**
     * Set & Get the default registration type.
     * @since v1.0
     */
    static get defaultRegistrationType(): RegistrationType { return this._registrationType; }
    static set defaultRegistrationType(type: RegistrationType) {
        this.defaultRegistrationType = type;
    }

    private async registerEventListeners() {
        var client = this._client;
        const basePath = path.join(__dirname, './listeners/');
        const files = fs.readdirSync(basePath).filter(f => f.endsWith(".js"));
        for (const file of files) {
            const filePath = path.join(basePath, file);
            var { default: Listener } = await import(filePath);
            try {
                const l = new Listener();
                if(l instanceof EventListener) {
                    if(l.getEventName() === Events.ClientReady) {
                        client.once(l.getEventName(), l.onExecute.bind(l, this));
                    } else {
                        client.on(l.getEventName(), l.onExecute.bind(l, this));
                    }
                }
            } catch(reason: any) {throw new Error(reason)}
        }
    }
}