import type { ApplicationCommand, Guild } from "discord.js";
import type { ContextCommand } from "./interactions/commands/application/ContextCommand";
import type { SlashCommand } from "./interactions/commands/application/SlashCommand";

import Pair from "./utils/Pair";
import DIH4DJSLogger from "./DIH4DJSLogger";

export default class SmartQueue {
    private slashCommands: SlashCommand[];
    private contextCommands: ContextCommand<any>[];

    constructor(slashCommands: SlashCommand[], contextCommands: ContextCommand<any>[]) {
        this.slashCommands = slashCommands;
        this.contextCommands = contextCommands;
    }

    public checkGlobal(existing: ApplicationCommand[]) {
        if(existing.length !== 0) {
            return this.removeDuplicates(existing);
        }
        return new Pair(this.slashCommands, this.contextCommands);
    }

    public checkGuild(existing: ApplicationCommand[], guild: Guild) {
        if(existing.length !== 0) {
            return this.removeDuplicates(existing, guild);
        }
        return new Pair(this.slashCommands, this.contextCommands);
    }

    private removeDuplicates(existing: ApplicationCommand[], guild?: Guild) {
        var global: boolean = guild === undefined;
        var prefix = `[${global ? "Global" : guild!.name}] `;
        DIH4DJSLogger.info(prefix + `Found ${existing.length} existing command(s)`);
        existing.forEach((cmd, idx) => {
            if(this.contextCommands.map((data) => cmd.name === data.getCommandData().name)
                    || this.slashCommands.map((data) => cmd.name === data.getCommandData().name)) {
                if(global) {
                    DIH4DJSLogger.info(prefix + "Found %s duplicate command, which will be ignored: %ss"
                        .replace("%s", cmd.type.toString())
                        .replace("%ss", cmd.name));
                }
                existing.splice(idx, 1);
            }
            return;
        });
        this.contextCommands.forEach((data, idx) => existing.map(p => {
            if(p.name === data.getCommandData().name) this.contextCommands.splice(idx, 1);
        }));
        this.slashCommands.forEach((data, idx) => existing.map(p => {
            if(p.name === data.getCommandData().name) this.slashCommands.splice(idx, 1);
        }));
        return new Pair(this.slashCommands, this.contextCommands);
    }
}