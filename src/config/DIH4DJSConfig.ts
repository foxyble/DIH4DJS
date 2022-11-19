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
import type { Client } from "discord.js";

export class DIH4DJSConfig {
    private client!: Client;
    private commandsPackages: string[] = Array.of();
    private registerOnReady: boolean = true;
    private testingGuild: string = "";

    /**
     * Creates a default instance
     */
    constructor() {}

    /**
     * Gets you the {@link Client} instance that {@link DIH4DJS} uses.
     * @returns The {@link Client} instance.
     */
    public getClient(): Client {
        return this.client;
    }

    /**
     * Sets the {@link Client} instance that {@link DIH4DJS} uses.
     * @param client The {@link Client} instance to use.
     */
    public setClient(client: Client) {
        this.client = client;
    }

    /**
     * Gets the commands packages where the commands are.
     * @returns The list of package names.
     */
    public getCommandPackages(): string[] {
        return this.commandsPackages;
    }

    /**
     * Sets on or more packages.
     * @param packages The packages where commands are located.
     */
    public setCommandPackages(packages: string[]) {
        this.commandsPackages = packages;
    }

    /**
     * True is all commands should be registered when the client is ready.
     * @returns true is they are getting registered, otherwise false.
     */
    public isRegisterOnReady(): boolean {
        return this.registerOnReady;
    }

    /**
     * True is all commands should be registered when the client is ready.
     * @param registerOnReady True is they are getting registered, otherwise false.
     */
    public setRegisterOnReady(registerOnReady: boolean) {
        this.registerOnReady = registerOnReady;
    }

    /**
     * Set the testing guild id.
     * @param guildId The testing guild id.
     */
    public setTestingGuild(guildId: string) {
        this.testingGuild = guildId;
    }

    /**
     * Gets the testing guild's id.
     * @returns The test guild id.
     */
    public getTestingGuild() {
        return this.testingGuild;
    }
}