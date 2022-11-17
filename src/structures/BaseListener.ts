import type { Client } from 'discord.js';

export default abstract class BaseListener {
    private eventName: string;

    /**
     * @param name The event name
     */
    constructor(name: string) {
        this.eventName = name;
    }

    public getName(): string { return this.eventName; }

    abstract execute(client: Client, ...args: any): void;
}