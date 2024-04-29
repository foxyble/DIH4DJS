import type { Client, ShardingManager } from 'discord.js';

export type DIH4DJSOptions = {
    main: Client | ShardingManager;
    packages: string[];
}