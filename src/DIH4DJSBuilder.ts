import type { Client } from "discord.js";

import fs from "node:fs";
import { join } from "node:path";
import BaseListener from "./structures/BaseListener";
import DIH4DJS from ".";

/**
 * Main builder for creating the interaction handler
 */
export default class DIH4DJSBuilder {
    private client!: Client;
    private pkgDir: string = "";

    public build(): DIH4DJS {
        this.registerListeners("./listeners");
        return new DIH4DJS(this.pkgDir, this.client);
    }

    private async registerListeners(dir: string = "") {
        const basePath = join(__dirname, dir);
        const files = fs.readdirSync(basePath).filter(f => f.endsWith(".js"));
        for (const file of files) {
            const filePath = join(basePath, file);
            var { default: Listener } = await import(filePath);
            try {
                const l = new Listener();
                if(l instanceof BaseListener) {
                    this.client.on(l.getName(), l.execute.bind(l, this.client));
                }
            } catch(err) {
                console.log(err);
            }
        }
    }

    /**
     * Set the client.
     * @param client The discord.js client object
     */
    public setClient(client: Client): DIH4DJSBuilder {
        this.client = client;
        return this;
    }

    /**
     * Set to base command and interaction handler directory.
     * @param dir The directory where commands and interaction handlers are
     */
    public setDirectory(dir: string): DIH4DJSBuilder {
        this.pkgDir = dir;
        return this;
    }
}