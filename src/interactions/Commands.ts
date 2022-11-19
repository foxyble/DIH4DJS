import { 
    SlashCommandBuilder, 
    ContextMenuCommandBuilder, 
    ApplicationCommandType, 
    ContextMenuCommandType 
} from 'discord.js';

export class Commands {
    /**
     * Create a slash command builder.
     * @param name The command name
     * @param description The command description
     * @returns {@link SlashCommandBuilder}
     */
    public static slash(name: string, description: string): SlashCommandBuilder {
        return new SlashCommandBuilder().setName(name).setDescription(description);
    }

    /**
     * Create a message context command builder.
     * @param name The command name
     * @returns {@link ContextMenuCommandBuilder}
     */
    public static message(name: string): ContextMenuCommandBuilder {
        return new ContextMenuCommandBuilder().setType(ApplicationCommandType.Message).setName(name);
    }

    /**
     * Create a user context command builder.
     * @param name The command name.
     * @returns {@link ContextMenuCommandBuilder}
     */
    public static user(name: string): ContextMenuCommandBuilder {
        return new ContextMenuCommandBuilder().setType(ApplicationCommandType.User).setName(name);
    }

    /**
     * Create a context command builder for the specified type.
     * @param type The command type
     * @param name The command name
     * @returns {@link ContextMenuCommandBuilder}
     */
    public static context(type: ContextMenuCommandType, name: string) {
        return new ContextMenuCommandBuilder().setType(type).setName(name);
    }
}