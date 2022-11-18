import type { 
    ContextMenuCommandBuilder, 
    MessageContextMenuCommandInteraction, 
    UserContextMenuCommandInteraction 
} from "discord.js";

import BaseCommand from "./BaseCommand";

export abstract class ContextCommand<E> extends BaseCommand<E, ContextMenuCommandBuilder> {}

export namespace ContextCommand {
    export abstract class User extends ContextCommand<UserContextMenuCommandInteraction> {}
    export abstract class Message extends ContextCommand<MessageContextMenuCommandInteraction> {}
}