import { Collection } from "discord.js";
import ComponentHandler from "../ComponentHandler";

/**
 * Represents a restricted command.
 */
export abstract class RestrictedCommand extends ComponentHandler {
    private COOLDOWN_CACHE: Collection<string, RestrictedCommand.Cooldown> = new Collection();

    private requiredGuilds: string[] = Array.of();
    private requiredPermissions: bigint[] = Array.of();
    private requiredUsers: string[] = Array.of();
    private requiredRoles: string[] = Array.of();
    private commandCooldown: number = 0;

    /**
     * Allows to required a set of {@link Guild}s only in which the command can get executed.
     * @param guilds An array of guild ids.
     */
    public setRequiredGuilds(...guilds: string[]) {
        this.requiredGuilds = guilds;
    }

    /**
     * The required guilds the command can be executed in.
     * @returns The array of guild ids.
     */
    public getRequiredGuilds(): string[] {
        return this.requiredGuilds;
    }

    /**
     * The list of permissions that is required by the user.
     * @returns The required permissions
     */
    public getRequiredPermissions(): bigint[] {
        return this.requiredPermissions;
    }

    /**
     * Set the required permissions the user needs to execute the command.
     * @param permissions List of permissions
     */
    public setRequiredPermissions(...permissions: bigint[]): void {
        this.requiredPermissions = permissions;
    }

    /**
     * The list of user ids that are allowed to execute the command.
     * @returns The list of user ids.
     */
    public getRequiredUsers(): string[] {
        return this.requiredUsers;
    }

    /**
     * Allows a set of users to execute the command.
     * @param users The list of user ids.
     */
    public setRequiredUsers(...users: string[]): void {
        this.requiredUsers = users;
    }

    /**
     * The list of role ids allowed to execute the command.
     * @returns The list of role ids.
     */
    public getRequiredRoles(): string[] {
        return this.requiredRoles;
    }

    /**
     * Allows a set of role ids to execute the command.
     * @param roles The list of role ids.
     */
    public setRequiredRoles(...roles: string[]): void {
        this.requiredRoles = roles;
    }

    /**
     * Allows to set cooldown for this command.
     * @param duration The duration the user will have to wait in milliseconds
     */
    public setCommandCooldown(duration: number) {
        this.commandCooldown = duration;
    }

    /**
     * Returns the timestamp the user has to wait between command executions.
     * @returns The timestamp
     */
    public getCommandCooldown(): number {
        return this.commandCooldown;
    }

    /**
     * Manually applys a cooldown for the specified user id.
     * @param userId The targets' user id.
     * @param nextUse The next time the command can be used.
     */
    public applyCooldown(userId: string, nextUse: number) {
        this.COOLDOWN_CACHE.set(userId, new RestrictedCommand.Cooldown(Date.now(), nextUse));
    }

    /**
     * Gets the cooldown when the specified user can execute the command again.
     * If the user has not executed the command yet it will return a {@link RestrictedCommand.Cooldown}
     * with both values {@link Date.now}
     * @param userId The targets' user id
     * @returns The timestamp at which the command can be executed again.
     */
    public retrieveCooldown(userId: string) {
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
    public hasCooldown(userId: string): boolean {
        const cooldown = this.retrieveCooldown(userId);
        return cooldown.getLastUse() <= cooldown.getNextUse() ? true : false;
    }
}

export namespace RestrictedCommand {
    export class Cooldown {
        private lastUse: number;
        private nextUse: number;

        constructor(lastUse: number, nestUse: number) {
            this.lastUse = lastUse;
            this.nextUse = nestUse;
        }

        /**
         * Gets you the {@link Date} of when the user can use the {@link RestrictedCommand} the nest time.
         * @returns The nest {@link Date} the command may be used again.
         */
        public getNextUse(): number {
            return this.nextUse;
        }

        /**
         * Gets you the {@link Date} the user has used {@link RestrictedCommand} the last time.
         * @returns The last {@link Date} the command was used.
         */
        public getLastUse(): number {
            return this.lastUse;
        }
    }
}