/**
 * Base class for making component ids.
 */
export default class ComponentIdBuilder {
    private static seperator = ":";

    private constructor() {}

    /**
     * Sets the default seperater to be used when constructing
     * a component id.
     * @param seperator The char to be used to split the id.
     */
    public static setDefaultSeperator(seperator: string): void {
        ComponentIdBuilder.seperator = seperator;
    }

    /**
     * Get the seperator
     * @returns The seperator
     */
    public static getSeperator() {
        return this.seperator;
    }

    /**
     * Creates new id
     * @param identifier 
     * @param args 
     * @returns Component id built string
     */
    public static build(identifier: string, ...args: Object[]): string {
        const sb: string[] = Array.of(identifier);
        if(args.length > 0) {
            args.map((item) => sb.push(item.toString()));
        }
        return sb.join(this.seperator);
    }

    /**
     * Splits an existing id.
     * @param id The component id.
     * @returns The seperated id.
     */
    public static split(id: string): string[] {
        return id.split(this.seperator);
    }
}