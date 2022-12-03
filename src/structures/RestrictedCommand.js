'use strict';

const { Collection } = require('discord.js');
const ComponentHandler = require("./ComponentHandler");
const DIH4DJS = require("../DIH4DJS");

/**
 * Options for a generic command
 * @typedef {Object} CommandOptions
 * @property {string} [registrationType] The type that the command should be registered as.
 * @property {string[]} [requiredGuilds] The guilds that are allowed to execute this command.
 * @property {string[]} [requiredUsers] The users that are allowed to execute the command.
 * @property {string[]} [requiredRoles] The required roles to execute this command.
 * @property {bigint[]} [permissions] The permissions this command will require.
 * @property {number} [cooldown] The cooldown of the command.
 * @property {import('./ComponentHandler').ComponentHandlerOptions} [components] The components
 * to be handled by the command (if any).
 */

class RestrictedCommand extends ComponentHandler {
    COOLDOWN_CACHE = new Collection();

    /**
     * @param {CommandOptions} options 
     */
    constructor(options) {
        var validOptions = {
            ...RestrictedCommand.createDefault(),
            ...options
        }
        super(validOptions.components);
        this.cmdOptions = validOptions;
    }

    get registrationType() { return this.cmdOptions.registrationType; }

    get requiredGuilds() { return this.cmdOptions.requiredGuilds; }

    get requiredUsers() { return this.cmdOptions.requiredUsers; }

    get requiredRoles() { return this.cmdOptions.requiredRoles; }

    get permissions() { return this.cmdOptions.permissions; }

    get cooldown() { return this.cmdOptions.cooldown; }

    /**
     * Manually applys a cooldown for the specified user id.
     * @param {string} userId The targets' user id.
     * @param {number} nextUse The next time the command can be used.
     */
    applyCooldown(userId, nextUse) {
        this.COOLDOWN_CACHE.set(userId, new RestrictedCommand.Cooldown(Date.now(), nextUse));
    }

    /**
     * Gets the cooldown when the specified user can execute the command again.
     * If the user has not executed the command yet it will return a {@link RestrictedCommand.Cooldown}
     * with both values {@link Date.now}
     * @param {string} userId The targets' user id
     * @returns The timestamp at which the command can be executed again.
     */
    retrieveCooldown(userId) {
        const cooldown = this.COOLDOWN_CACHE.get(userId);
        if (cooldown === null || cooldown === undefined) {
            return new RestrictedCommand.Cooldown(0, 0);
        }
        return cooldown;
    }

    /**
     * Returns whether the command can be used by the specified user.
     * @param {string} userId The target user id.
     * @returns Whether the command can be executed.
     */
    hasCooldown(userId) {
        const cooldown = this.retrieveCooldown(userId);
        return this.cooldown - (Date.now() - cooldown.lastUse) > 0;
    }

    /**
     * Creates the default command options
     * @returns {CommandOptions}
     */
    static createDefault() {
        return {
            registrationType: DIH4DJS.defaultRegistrationType,
            requiredGuilds: [],
            requiredRoles: [],
            requiredUsers: [],
            permissions: [],
            components: {}
        }
    }
}

module.exports = RestrictedCommand;

(function (RestrictedCommand) {
    class Cooldown {
        constructor(lastUse, nextUse) {
            this.lastUse = lastUse;
            this.nextUse = nextUse;
        }
    }
    RestrictedCommand.Cooldown = Cooldown;
})(RestrictedCommand = module.exports || (module.exports = {}));