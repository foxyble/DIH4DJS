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