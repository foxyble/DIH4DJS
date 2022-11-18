import type { Client } from "discord.js";

import DIH4DJS from ".";
import DIH4DJSConfig from "./config/DIH4DJSConfig";

/**
 * Main builder for creating the interaction handler
 */
export default class DIH4DJSBuilder {
    private config: DIH4DJSConfig;
    private client: Client;

    constructor(client: Client) {
        this.config = new DIH4DJSConfig();
        this.client = client;
    }

    /**
     * Set the client.
     * @param client The discord.js client object
     */
    public setClient(client: Client): DIH4DJSBuilder {
        return new DIH4DJSBuilder(client);
    }

    /**
     * Set to base command and interaction handler directory.
     * @param packages The directory where commands and interaction handlers are
     */
    public setCommandPackages(...packages: string[]): DIH4DJSBuilder {
        this.config.setCommandPackages(packages);
        return this;
    }

    /**
     * Sets the testing guild's id.
     * @param guildId The testing guild id.
     */
    public setTestingGuild(guildId: string) {
        this.config.setTestingGuild(guildId);
        return this;
    }

    /**
     * 
     * @returns 
     */
    public disableUnknownCommandDeletion() {
        this.config.setDeleteUnknownCommands(false);
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