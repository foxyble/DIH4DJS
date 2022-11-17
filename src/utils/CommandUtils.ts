export default class CommandUtils {
    /**
     * Used to create one command name out of the SlashCommand, SlashSubCommandGroup and SlashSubCommand.
     * @param args The arguments as {@link string}s you want to join together.
     * @returns combined string
     */
    public static buildCommandPath(...args: string[]) {
        return args.join(" ");
    }
}