const { Client, Events } = require("discord.js");
const { DIHOptions } = require("./utils/Options");
const DIH4DJSLogger = require("./DIH4DJSLogger");
const Options = require("./utils/Options");
const path = require("node:path");
const fs = require("node:fs");
const ActionListener = require("./structures/interfaces/ActionListener");
const InteractionManager = require("./managers/InteractionManager");
const ComponentManager = require("./managers/ComponentManager");

class DIH4DJS {
    static registrationType;
    /**
     * @param {Client} client 
     * @param {DIHOptions} options 
     */
    constructor(client, options) {
        this.client = client;
        this.options = Options.validateOptions(options);

        /**
         * The component manager
         * @type {ComponentManager}
         */
        this.componentManager = new ComponentManager();

        /**
         * The interaction manager
         * @type {InteractionManager}
         */
        this.interactionManager = new InteractionManager(this);

        /**
         * Registers event listeners.
         */
        this.registerEventListeners();
    }

    /**
     * Manually runs {@link InteractionManager#registerInteractions}.
     */
    registerInteractions() {
        this.interactionManager.registerInteractions();
    }

    addSlashCommands(...commands) {
        this.interactionManager.slashCommands.push(...commands);
    }

    addContextCommands(...commands) {
        this.interactionManager.contextCommands.push(...commands);
    }

    get packages() {
        return this.options.packages;
    }

    get isRegisterOnReady() {
        return this.options.registerOnReady;
    }

    get testingServer() {
        return this.options.testingServer;
    }

    get isCooldownNotification() {
        return this.options.cooldownNotification;
    }

    static get defaultRegistrationType() {
        return this.registrationType;
    }
    static set defaultRegistrationType(type) {
        this.registrationType = type;
    }

    async registerEventListeners() {
        const basePath = path.join(__dirname, './listeners');
        const files = fs.readdirSync(basePath).filter(f => f.endsWith(".js"));
        for (const file of files) {
            const filePath = path.join(basePath, file);
            const Listener = require(filePath);
            try {
                const al = new Listener();
                if (!al instanceof ActionListener) return;
                DIH4DJSLogger.info(`Listening for the @${al.eventName} event.`);
                if (al.eventName === Events.ClientReady) {
                    this.client.once(al.eventName, al.execute.bind(al, this));
                } else {
                    this.client.on(al.eventName, al.execute.bind(al, this));
                }
            } catch (err) {
                DIH4DJSLogger.warn("Failed to load an action listener.");
            }
        }
    }
}

module.exports = DIH4DJS;