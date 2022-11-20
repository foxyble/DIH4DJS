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

/**
 * A pair of two elements.
 * @param <F> The first value.
 * @param <S> The second value.
 * @since v1.0
 */
export class Pair<F, S> {
    private _first: F;
    private _second: S;

    /**
     * Creates a new {@link Pair} of to {@link Object}s
     * @param first The first {@link Object}.
     * @param second The second {@link Object}.
     */
    constructor(first: F, second: S) {
        this._first = first;
        this._second = second;
    }

    /**
     * Gets you the {@link Object} that was defined first.
     * @returns The first {@link Object}
     */
    get first(): F {
        return this._first;
    }

    /**
     * Gets you the {@link Object} that was defined second.
     * @returns The second {@link Object}
     */
    get second(): S {
        return this._second;
    }
}