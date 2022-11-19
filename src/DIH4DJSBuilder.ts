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

import { DIH4DJS } from "./index";
import { DIH4DJSConfig } from "./config/DIH4DJSConfig";

/**
 * Main builder for creating the interaction handler
 */
export class DIH4DJSBuilder {
    private config: DIH4DJSConfig;

    constructor() {
        this.config = new DIH4DJSConfig();
    }

    /**
     * Set the client.
     * @param client The discord.js client object
     * @returns {@link DIH4DJSBuilder} for chaining convenience.
     */
    public setClient(client: Client): DIH4DJSBuilder {
        this.config.setClient(client);
        return this;
    }

    /**
     * Set to base command and interaction handler directory.
     * @param packages The directory where commands and interaction handlers are
     * @returns {@link DIH4DJSBuilder} for chaining convenience.
     */
    public setCommandPackages(...packages: string[]): DIH4DJSBuilder {
        this.config.setCommandPackages(packages);
        return this;
    }

    /**
     * Sets the testing guild's id.
     * @param guildId The testing guild id.
     * @returns {@link DIH4DJSBuilder} for chaining convenience.
     */
    public setTestingGuild(guildId: string): DIH4DJSBuilder {
        this.config.setTestingGuild(guildId);
        return this;
    }

    /**
     * Sets whether commands should be automatically registered.
     * @returns {@link DIH4DJSBuilder} for chaining convenience.
     */
    public disableAutomaticCommandRegistration(): DIH4DJSBuilder {
        this.config.setRegisterOnReady(false);
        return this;
    }

    /**
     * Sets whether command loggin should be disabled.
     * @returns {@link DIH4DJSBuilder} for chaining convenience.
     */
    public disabledCommandLogging(): DIH4DJSBuilder {
        this.config.setDisableLogging(true);
        return this;
    }

    /**
     * Returns a valid {@link DIH4DJS} instance.
     * @returns The built, usable {@link DIH4DJS}
     */
    public build(): DIH4DJS {
        if(this.config.getClient() === null || this.config.getClient() === undefined)
            throw new Error("Client cannot be null or undefined.")
        for(const pkg of this.config.getCommandPackages()) {
            if(pkg.length === 0) {
                throw new Error("Commands package cannot be empty or blank.");
            }
        }
        return new DIH4DJS(this.config);
    }
}