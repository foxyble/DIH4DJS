export default class Pair<F, S> {
    private first: F;
    private second: S;

    /**
     * Creates a new {@link Pair} of to {@link Object}s
     * @param first The first {@link Object}.
     * @param second The second {@link Object}.
     */
    public constructor(first: F, second: S) {
        this.first = first;
        this.second = second;
    }

    /**
     * Gets you the {@link Object} that was defined first.
     * @returns The first {@link Object}
     */
    public getFirst(): F {
        return this.first;
    }

    /**
     * Gets you the {@link Object} that was defined second.
     * @returns The second {@link Object}
     */
    public getSecond(): S {
        return this.second;
    }
}