import type { Client } from "discord.js";
import type { ExecutableCommand } from "../ExecutableCommand";

import { RestrictedCommand } from "../RestrictedCommand";

export abstract class AppCommand<E, T> extends RestrictedCommand implements ExecutableCommand<E> {
    private data!: T;

    constructor(data: T) {
        super();
        this.data = data;
    }

    /**
     * Sets the command data.
     * @param data The desired command builder
     */
    public setCommandData(data: any) {
        this.data = (data as T);
    }

    /**
     * Gets the command data.
     * @returns The command builder
     */
    public getCommandData(): T {
        return this.data;
    }

    execute(_client: Client, _interaction: E): void {}
}