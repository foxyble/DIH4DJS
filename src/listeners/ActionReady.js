'use strict';

const { Events } = require("discord.js");
const DIH4DJS = require("../DIH4DJS");
const ActionListener = require("../structures/interfaces/ActionListener");

class ActionReady extends ActionListener {
    constructor() {
        super(Events.ClientReady);
    }

    /**
     * @param {DIH4DJS} dih4djs 
     */
    async execute(dih4djs) {
        setTimeout(() => {
            if (dih4djs === null || dih4djs === undefined) return;
            if (dih4djs.isRegisterOnReady && dih4djs.interactionManager !== null) {
                dih4djs.registerInteractions();
            }
        }, 30000);
    }
}

module.exports = ActionReady;