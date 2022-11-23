'use strict';

const { ApplicationCommand } = require("discord.js");
const ContextCommand = require("./ContextCommand");
const SlashCommand = require("./SlashCommand");
const Pair = require("../utils/Pair");
const DIH4DJSLogger = require("../DIH4DJSLogger");

class SmartQueue {
    /**
     * @param {SlashCommand[]} slashCommands 
     * @param {ContextCommand[]} contextCommands 
     */
    constructor(slashCommands, contextCommands) {
        /**@type {SlashCommand[]} */
        this.slashCommands = slashCommands;
        /**@type {ContextCommand[]} */
        this.contextCommands = contextCommands;
    }

    /**
     * Compares the specified {@link Guild} with aready existing commands, removes duplicates.
     * @param {ApplicationCommand[]} existing A list of all existing {@link ApplicationCommand}
     * @returns {Pair} with the remaining {@link SlashCommandBuilder} & {@link ContextMenuCommandBuilder}.
     */
    checkGlobal(existing) {
        if (existing.length !== 0) {
            return this.removeDuplicates(existing);
        }
        return new Pair(this.slashCommands, this.contextCommands);
    }

    /**
     * Compares the specified {@link Guild} with aready existing commands, removes duplicates.
     * @param {ApplicationCommand[]} existing A list of all existing {@link ApplicationCommand}
     * @param {Guild} guild The guild to retrieve the already existing commands.
     * @returns A {@link Pair} with the remaining {@link SlashCommandBuilder} & {@link ContextMenuCommandBuilder}.
     */
    checkGuild(existing, guild) {
        if (existing.length !== 0) {
            return this.removeDuplicates(existing, guild);
        }
        return new Pair(this.slashCommands, this.contextCommands);
    }

    /**
     * Removes all duplicate {@link ApplicationCommand}
     * @param {ApplicationCommand[]} existing A list of all existing {@link ApplicationCommand}
     * @param {Guild} [guild] An optional guild parameter which is used with {@link SmartQueue#checkGuild}
     * @returns {Pair}
     */
    removeDuplicates(existing, guild) {
        var global = guild === undefined;
        var prefix = `[${global ? "Global" : guild.name}] `;
        DIH4DJSLogger.info(prefix + `Found ${existing.length} existing command(s)`, DIH4DJSLogger.Type.SmartQueue);
        existing.forEach((cmd, idx) => {
            if (this.contextCommands.map((value) => cmd.name === value.data.name)
                || this.slashCommands.map((value) => cmd.name === value.data.name)) {
                existing.splice(idx, 1);
            }
            return;
        });
        this.contextCommands.forEach((value, idx) => existing.map(p => {
            if (p.name === value.data.name)
                this.contextCommands.splice(idx, 1);
        }));
        this.slashCommands.forEach((value, idx) => existing.map(p => {
            if (p.name === value.data.name)
                this.slashCommands.splice(idx, 1);
        }));
        return new Pair(this.slashCommands, this.contextCommands);
    }
}

module.exports = SmartQueue;