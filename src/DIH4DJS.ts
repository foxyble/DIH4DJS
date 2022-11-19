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
import { Client, Events } from "discord.js";
import type { SlashCommand } from "./interactions/commands/application/SlashCommand";
import type { ContextCommand } from "./interactions/commands/application/ContextCommand";
import { RegistrationType } from "./interactions/commands/application/RegistrationType";
import type { DIH4DJSConfig } from "./config/DIH4DJSConfig";
import { InteractionHandler } from "./InteractionHandler";
import fs from 'node:fs';
import path from 'node:path';
import EventListener from "./listeners/abstract/EventListener";

export class DIH4DJS {
    private static registrationType: RegistrationType = RegistrationType.Global;

    private config: DIH4DJSConfig;

    private handler: InteractionHandler;

    constructor(config: DIH4DJSConfig) {
        this.validateConfig(config);
        this.config = config;
        /**
         * Creates a new {@link InteractionHandler}
         */
        this.handler = new InteractionHandler(this);
        this.registerEventListeners();
    }

    private async registerEventListeners() {
        var client = this.config.getClient();
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

    /**
     * Gets the {@link DIH4DJSConfig} for the client instance.
     * @returns {DIH4DJSConfig}.
     */
    public getConfig(): DIH4DJSConfig {
        return this.config;
    }

    /**
     * The Interaction handler instance
     * @returns {InteractionHandler}
     */
    public getInteractionHandler(): InteractionHandler {
        return this.handler;
    }

    /**
     * Register all commands and interactions.
     */
    public registerInteractions() {
        this.handler.registerInteractions();
    }

    /**
     * Manually register {@link SlashCommand}s.
     * @param commands An array of commands to register
     */
    public addSlashCommands(...commands: SlashCommand[]) {
        commands.forEach((c) => this.handler.slashCommands.push(c));
    }

    /**
     * Manually register {@link ContextCommand}s.
     * @param commands An array of commands to register
     */
    public addContextCommands(...commands: ContextCommand<any>[]) {
        commands.forEach((c) => this.handler.contextCommands.push(c));
    }

    /**
     * Gets the {@link Client} instance.
     * @returns {Client} The client.
     */
    public getClient(): Client {
        return this.config.getClient();
    }

    /**
     * Gets the packages where all the commands are.
     * @returns The commands packages
     */
    public getPackages(): string[] {
        return this.config.getCommandPackages();
    }

    /**
     * Get the testing guild id.
     * @returns The testing guild id.
     */
    public getTestGuild() {
        return this.config.getTestingGuild();
    }

    /**
     * Set the default registration type
     * @param type The {@link RegistrationType}.
     */
    public static setDefaultRegistrationType(type: RegistrationType) {
        this.registrationType = type;
    }
    /**
     * Gets the default registration type.
     * @returns {@link RegistrationType}
     */
    public static getDefaultRegistrationType(): RegistrationType {
        return this.registrationType;
    }

    /**
     * Validates the {@link DIH4DJSConfig} to all required entires are there.
     * @param config The {@link DIH4DJSConfig}.
     */
    private validateConfig(config: DIH4DJSConfig) {
        if(config.getClient() === null) {
            throw new Error("Client instance may not be null!");
        }
        if(config.getCommandPackages() === null) {
            throw new Error("Command packages may not be null!");
        }
    }
}