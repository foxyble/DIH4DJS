import { Events } from "discord.js";
import type DIH4DJS from "../index";
import EventListener from "./abstract/EventListener"

export default class onReady extends EventListener {
    constructor() {
        super(Events.ClientReady);
    }

    onExecute(dih4djs: DIH4DJS): void {
        if(dih4djs.getPackages() === null) return;
        if(dih4djs.getConfig().isRegisterOnReady() && dih4djs.getInteractionHandler() !== null) {
            dih4djs.registerInteractions();
        }
    }
}