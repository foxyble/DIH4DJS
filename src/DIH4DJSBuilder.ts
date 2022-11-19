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

import { DIH4DJS } from "./DIH4DJS";
import { DIH4DJSConfig } from "./config/DIH4DJSConfig";

/**
 * Main builder for creating the interaction handler
 */
export class DIH4DJSBuilder {
    private config: DIH4DJSConfig;
    private client: Client;

    private constructor(client: Client) {
        this.config = new DIH4DJSConfig();
        this.client = client;
    }

    /**
     * Set the client.
     * @param client The discord.js client object
     * @returns The {@link DIH4DJS} for chaining convenience.
     */
    public setClient(client: Client): DIH4DJSBuilder {
        return new DIH4DJSBuilder(client);
    }

    /**
     * Set to base command and interaction handler directory.
     * @param packages The directory where commands and interaction handlers are
     * @returns The {@link DIH4DJS} for chaining convenience.
     */
    public setCommandPackages(...packages: string[]): DIH4DJSBuilder {
        this.config.setCommandPackages(packages);
        return this;
    }

    /**
     * Sets the testing guild's id.
     * @param guildId The testing guild id.
     * @returns The {@link DIH4DJS} for chaining convenience.
     */
    public setTestingGuild(guildId: string) {
        this.config.setTestingGuild(guildId);
        return this;
    }

    /**
     * Whether DIH4DJS should automatically register all interactions on each ready event.
     * @returns The {@link DIH4DJS} for chaining convenience.
     */
    public disableAutomaticCommandRegistration() {
        this.config.setRegisterOnReady(false);
        return this;
    }

    public build(): DIH4DJS {
        for(const pkg of this.config.getCommandPackages()) {
            if(pkg.length === 0) {
                throw new Error("Commands package cannot be empty or blank");
            }
        }
        this.config.setClient(this.client);
        return new DIH4DJS(this.config);
    }
}