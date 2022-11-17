/**
 * Types
 */
import type { Client } from "discord.js";
import type ExecutableCommand from "./interactions/commands/ExecutableCommand";
/**
 * Interactions
 */
import Commands from "./interactions/Commands";
import RestrictedCommand from "./interactions/commands/RestrictedCommand";
import AppCommand from "./interactions/commands/application/AppCommand";
import BaseCommand from "./interactions/commands/application/BaseCommand";
import { ContextCommand } from "./interactions/commands/application/ContextCommand";
import { RegistrationType } from "./interactions/commands/application/RegistrationType";
import { SlashCommand } from "./interactions/commands/application/SlashCommand";
/**
 * Utils
 */
import CommandUtils from "./utils/CommandUtils";
import ComponentIdBuilder from "./utils/ComponentIdBuilder";
/**
 * Misc
 */
import DIH4DJSBuilder from "./DIH4DJSBuilder";
import InteractionHandler from "./InteractionHandler";

export default class DIH4DJS {
    private static instance: DIH4DJS|null = null;
    private static registrationType: RegistrationType;

    public static getInstance(): DIH4DJS { return this.instance! }

    static {
        this.registrationType = RegistrationType.GLOBAL;
    }

    private client: Client;
    private pkgDir: string = "";

    private handler: InteractionHandler;

    constructor(pkgDir: string, client: Client) {
        DIH4DJS.instance = this;

        this.client = client;
        this.pkgDir = pkgDir;

        /**
         * Creates a new {@link InteractionHandler}
         */
        this.handler = new InteractionHandler(this);
    }

    /**
     * The Interaction handler instance
     * @returns {@link InteractionHandler}
     */
    public getInteractionHandler(): InteractionHandler {
        return this.handler;
    }

    public getClient(): Client {
        return this.client;
    }

    public getPackageDir(): string {
        return this.pkgDir;
    }

    /**
     * Set the default registration type
     * @param type The {@link RegistrationType}.
     */
    public static setDefaultRegistrationType(type: RegistrationType) {
        this.registrationType = type;
    }
    /**
     * Gets the default registration type.
     * @returns {@link RegistrationType}
     */
    public static getDefaultRegistrationType(): RegistrationType {
        return this.registrationType;
    }
}

export {
    /**
     * Export Interactions
     */
    Commands,
    ExecutableCommand,
    RestrictedCommand,
    AppCommand,
    BaseCommand,
    ContextCommand,
    RegistrationType,
    SlashCommand,
    /**
     * Utils
     */
    CommandUtils,
    ComponentIdBuilder,
    // ------------------
    DIH4DJSBuilder,
    InteractionHandler
}