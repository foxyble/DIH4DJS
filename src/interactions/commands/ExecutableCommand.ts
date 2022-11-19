import type { Client } from "discord.js";

/**
 * Represents a command that can be executed.
 * @param <E> the interaction to pass to the command.
 */
export interface ExecutableCommand<E> {
    /**
     * The method that gets called once the command gets executed.
     * @param interaction 
     */
    execute(client: Client, interaction: E): void;
}