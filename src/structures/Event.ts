import { Client } from "client-discord";
import { ClientEvents } from "discord.js";

export class Event<T extends keyof ClientEvents> {
    event: T
    disabled?: boolean
    execute: (client: Client, ...args: ClientEvents[T]) => Promise<any>

    constructor(options: Event<T>) {
        Object.assign(this, options);
    }
}