/**
 * DIH4DJS is a power package to handle interactions using 
 * the discord.js library.
 * Copyright (C) 2022  OoP1nk
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */
import type { 
    ContextMenuCommandBuilder, 
    MessageContextMenuCommandInteraction, 
    UserContextMenuCommandInteraction 
} from "discord.js";
import { BaseApplicationCommand } from "./BaseApplicationCommand";

/**
 * @since v1.0
 */
export abstract class ContextCommand<E> extends BaseApplicationCommand<E, ContextMenuCommandBuilder> {}

export namespace ContextCommand {
    export abstract class User extends ContextCommand<UserContextMenuCommandInteraction> {}
    export abstract class Message extends ContextCommand<MessageContextMenuCommandInteraction> {}
}