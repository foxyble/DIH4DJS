import type { RegistrationType } from "./RegistrationType";

import { DIH4DJS } from "../../../index";
import { AppCommand } from "./AppCommand";

export abstract class BaseCommand<E, T> extends AppCommand<E, T> {
    private registrationType: RegistrationType = DIH4DJS.getDefaultRegistrationType();

    /**
     * The {@link RegistrationType} the command got assigned.
     * @returns the {@link RegistrationType}.
     */
    public getRegistrationType(): RegistrationType {
        return this.registrationType;
    }

    /**
     * How the command should be queued.
     * @param type the {@link RegistrationType} to set.
     */
    public setRegistrationType(type: RegistrationType): void {
        this.registrationType = type;
    }
}