export default abstract class EventListener {
    private eventName: string;

    constructor(name: string) {
        this.eventName = name;
    }

    public getEventName() {
        return this.eventName;
    }

    abstract onExecute(..._args: any): void;
}