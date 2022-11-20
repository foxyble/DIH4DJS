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
import type { RegistrationType } from "./RegistrationType";
import { InvalidPackage } from "../errors/InvalidPackage";
import { DIH4DJS } from "../DIH4DJS";
import { DIH4DJSLogger } from "../DIH4DJSLogger";

export type DIHOptions = {
    packages?: string[];
    defaultRegistrationType?: RegistrationType;
    testingServer?: string;
    registerOnReady?: boolean;
    logging?: {
        enabled?: boolean;
        blocked?: DIH4DJSLogger.Type[];
    }
}

/**
 * Utilities for DIH4DJS options.
 * @since v1.1
 */
export class DIH4DJSOptions {

    /**
     * Checks whether the config options are valid.
     * @param options The options provided.
     * @since v1.1
     */
    static validateOptions(options: DIHOptions): DIHOptions {
        if(options === undefined) return this.createDefault();
        if(options.packages === null || options.packages?.length === 0) throw new InvalidPackage("Found empty command package.");
        // Adds the blocked logging types
        if(options.logging && options.logging.blocked?.length !== undefined) DIH4DJSLogger.blockedLogTypes.push(...options.logging?.blocked!);
        // Sets default registration type
        if(options.defaultRegistrationType) DIH4DJS.defaultRegistrationType = options.defaultRegistrationType;
        return {
            ...this.createDefault(),
            ...options
        };
    }

    /**
     * Creates the default {@link DIHOptions}.
     * @returns {@link DIHOptions}
     * @since v1.1
     */
    private static createDefault(): DIHOptions {
        return {
            packages: ["./commands/"],
            registerOnReady: true,
            logging: {
                enabled: true
            }
        }
    }
}