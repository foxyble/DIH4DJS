'use strict';

const DIH4DJS = require("../DIH4DJS");
const RestrictedCommand = require("./RestrictedCommand");
const { CommandOptions } = require('./RestrictedCommand');

class BaseApplicationCommand extends RestrictedCommand {
    /**
     * @param {any} data 
     * @param {CommandOptions} options 
     */
    constructor(data, options) {
        super(options);
        this.data = data;
    }

    /**
     * Sets the command data.
     * @param data
     */
    setCommandData(data) {
        this.data = data;
    }

    async execute(client, interaction) { }
}

module.exports = BaseApplicationCommand;