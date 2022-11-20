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
import { Collection } from "discord.js";
import type { RegistrationType } from "../util/RegistrationType";
import { ComponentHandler, ComponentHandlerOptions } from "./ComponentHandler";

export type CommandOptions = {
    registrationType?: RegistrationType;
    requiredGuilds?: string[];
    requiredUsers?: string[];
    requiredRoles?: string[];
    permissions?: bigint[];
    cooldown?: number;
    components: ComponentHandlerOptions;
}

/**
 * Represents a restricted command.
 * @since v1.1
 */
export abstract class RestrictedCommand extends ComponentHandler {
    private COOLDOWN_CACHE: Collection<string, RestrictedCommand.Cooldown> = new Collection();

    private _options: CommandOptions;

    constructor(options: CommandOptions) {
        super(options.components);
        this._options = options;
    }

    /**
     * Gets the {@link RegistrationType} of the specified command.
     * @returns {RegistrationType}.
     */
    get registrationType(): RegistrationType {
        return this._options.registrationType!;
    }

    /**
     * The required guilds the command can be executed in.
     * @returns The array of guild ids.
     */
    get requiredGuilds(): string[] {
        return this._options.requiredGuilds! || [];
    }

    /**
     * The list of permissions that is required by the user.
     * @returns The required permissions
     */
    get permissions(): bigint[] {
        return this._options.permissions! || [];
    }

    /**
     * The list of user ids that are allowed to execute the command.
     * @returns The list of user ids.
     */
    get requiredUsers(): string[] {
        return this._options.requiredUsers! || [];
    }

    /**
     * The list of role ids allowed to execute the command.
     * @returns The list of role ids.
     */
    get requiredRoles(): string[] {
        return this._options.requiredRoles! || [];
    }

    /**
     * Returns the timestamp the user has to wait between command executions.
     * @returns The timestamp
     */
    get cooldown(): number {
        return this._options.cooldown!;
    }

    /**
     * Manually applys a cooldown for the specified user id.
     * @param userId The targets' user id.
     * @param nextUse The next time the command can be used.
     */
    applyCooldown(userId: string, nextUse: number) {
        this.COOLDOWN_CACHE.set(userId, new RestrictedCommand.Cooldown(Date.now(), nextUse));
    }

    /**
     * Gets the cooldown when the specified user can execute the command again.
     * If the user has not executed the command yet it will return a {@link RestrictedCommand.Cooldown}
     * with both values {@link Date.now}
     * @param userId The targets' user id
     * @returns The timestamp at which the command can be executed again.
     */
    retrieveCooldown(userId: string) {
        var cooldown = this.COOLDOWN_CACHE.get(userId);
        if(cooldown === null || cooldown === undefined) 
            return new RestrictedCommand.Cooldown(Date.now(), Date.now());
        return cooldown;
    }

    /**
     * Returns whether the command can be used by the specified user.
     * @param userId The target user id.
     * @returns Whether the command can be executed.
     */
    hasCooldown(userId: string): boolean {
        const cooldown = this.retrieveCooldown(userId);
        return cooldown.lastUse <= cooldown.nextUse ? true : false;
    }
}

export namespace RestrictedCommand {
    export class Cooldown {
        private _lastUse: number;
        private _nextUse: number;

        constructor(lastUse: number, nestUse: number) {
            this._lastUse = lastUse;
            this._nextUse = nestUse;
        }

        /**
         * Gets you the {@link Date} of when the user can use the {@link RestrictedCommand} the nest time.
         * @returns The nest {@link Date} the command may be used again.
         */
        get nextUse(): number { return this._nextUse; }

        /**
         * Gets you the {@link Date} the user has used {@link RestrictedCommand} the last time.
         * @returns The last {@link Date} the command was used.
         */
        get lastUse(): number { return this._lastUse; }
    }
}