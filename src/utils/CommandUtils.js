'use strict';

const Pair = require("./Pair");
const { RegistrationType } = require("./RegistrationType");

class CommandUtils {
    /**
     * Used to create one command name out of the SlashCommand, SlashSubCommandGroup and SlashSubCommand.
     * @param {string[]} args The arguments as {@link string}s you want to join together.
     * @returns Combined string
     * @since v1.0
     */
    static buildCommandPath(...args) {
        return args.join(" ");
    }

    /**
     * Filter given commands by {@link RegistrationType}.
     * @param {Pair} pair The commands to be filtered.
     * @param {RegistrationType} type The type to filter by.
     * @returns {Pair} of filtered commands.
     */
    static filterByType(pair, type) {
        return new Pair(pair.first.filter(c => c.registrationType === type), pair.second.filter(c => c.registrationType === type));
    }

    /**
     * Builds a comma spread list of command names.
     * @param {any[]} command The list of context commands.
     * @param {any[]} slash The list of slash commands.
     * @returns A comma spread list of command names.
     * @since v1.2
     */
    static getNames(command, slash) {
        var names = "";
        command.forEach((c) => names += names.length === 0 ? `${c.data.name}` : `, ${c.data.name}`);
        slash.forEach((c) => names += names.length === 0 ? `${c.data.name}` : `, ${c.data.name}`);
        return names;
    }
}

module.exports = CommandUtils;