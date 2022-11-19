import { 
    SlashCommandBuilder, 
    ContextMenuCommandBuilder, 
    ApplicationCommandType, 
    ContextMenuCommandType, 
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder
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
     * Create a slashcommand subcommand builder.
     * @param name The command name
     * @param description The command description
     * @returns {@link SlashCommandSubcommandBuilder}
     */
    public static slashSub(name: string, description: string): SlashCommandSubcommandBuilder {
        return new SlashCommandSubcommandBuilder().setName(name).setDescription(description);
    }

    /**
     * Create a slashcommand subcommand group builder.
     * @param name The command name
     * @param description The command description
     * @returns {@link SlashCommandSubcommandGroupBuilder}
     */
    public static slashGroup(name: string, description: string): SlashCommandSubcommandGroupBuilder {
        return new SlashCommandSubcommandGroupBuilder().setName(name).setDescription(description);
    }

    /**
     * Create a context command builder for the specified type.
     * @param type The command type
     * @param name The command name
     * @returns {@link ContextMenuCommandBuilder}
     */
    public static context(type: ContextMenuCommandType, name: string): ContextMenuCommandBuilder {
        return new ContextMenuCommandBuilder().setType(type).setName(name);
    }

    /**
     * Create a message context command builder.
     * @param name The command name
     * @returns {@link ContextMenuCommandBuilder}
     */
    public static contextMessage(name: string): ContextMenuCommandBuilder {
        return new ContextMenuCommandBuilder().setType(ApplicationCommandType.Message).setName(name);
    }

    /**
     * Create a user context command builder.
     * @param name The command name.
     * @returns {@link ContextMenuCommandBuilder}
     */
    public static contextUser(name: string): ContextMenuCommandBuilder {
        return new ContextMenuCommandBuilder().setType(ApplicationCommandType.User).setName(name);
    }
}