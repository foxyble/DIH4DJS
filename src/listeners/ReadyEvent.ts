import type { Client } from "discord.js";

import BaseListener from "../structures/BaseListener";
import DIH4DJSLogger from "../DIH4DJSLogger";

export default class ReadyEvent extends BaseListener {

    /**
     * Listens for the "ready" event.
     */
    constructor() {
        super("ready");
    }

    /**
     * Runs when the client is in ready state.
     * @param client The discord.js client instance.
     */
    execute(_client: Client): void {
        DIH4DJSLogger.info("Client is online");
    }
}