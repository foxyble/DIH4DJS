import type { Client } from "discord.js";

export default class DIH4DJSConfig {
    private client!: Client;
    private commandsPackages: string[] = Array.of();
    private registerOnReady: boolean = true;
    private deleteUnknownCommands: boolean = true;
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
     * True is unknown commands should be deleted and false if not.
     * @returns True if they are getting deleted, otherwise false.
     */
    public isDeleteUnknownCommands(): boolean {
        return this.deleteUnknownCommands;
    }

    /**
     * True is unknown commands should be deleted and false if not.
     * @param deleteUnknownCommands True if they are getting deleted, otherwise false.
     */
    public setDeleteUnknownCommands(deleteUnknownCommands: boolean) {
        this.deleteUnknownCommands = deleteUnknownCommands;
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