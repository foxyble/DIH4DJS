'use strict';

class ComponentIdBuilder {
    static seperator = ":";

    static setDefaultSeperator(seperator) {
        ComponentIdBuilder.seperator = seperator;
    }

    /**
     * Creates new id
     * @param {string} identifier
     * @param {string[]} args
     * @returns Component id built string
     */
    static build(identifier, ...args) {
        const sb = Array.of(identifier);
        if (args.length > 0) {
            args.map(item => sb.push(item.toString()));
        }
        return sb.join(this.seperator);
    }

    /**
     * Splits an existing id.
     * @param {string} id The component id.
     * @returns The seperated id.
     */
    static split(id) {
        return id.split(this.seperator);
    }
}

module.exports = ComponentIdBuilder;