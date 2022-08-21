import { Guild, User, Collection, GuildTextBasedChannel } from "discord.js"
import { Mute, Punishment, Response } from "./CustomEventTypes"
import { Guild as MongoGuild } from "../database/models/Guild";
import { CurrencyType } from "./Currency";
import { HeroId } from "../heroes/heroes-attr";

export interface CustomEvents {
    mute: [Mute: Mute, _channel: GuildTextBasedChannel]
    unmute: [Mute: { targetId: string, authorId: string }, _channel: GuildTextBasedChannel]
    warnCreate: [Warn: Punishment, _channel: GuildTextBasedChannel]
    warnRemove: [Warn: Punishment & { authorId: string }, _channel: GuildTextBasedChannel]
    warnResetUser: [Warn: { warns: Punishment[], targetId: string, authorId: string }, User: User, _channel: GuildTextBasedChannel]
    warnResetAll: [Warn: { warns: Punishment[], authorId: string }, _channel: GuildTextBasedChannel]
    kick: [Kick: { autocomplete: boolean, targetId: string, authorId: string, reason?: string }, _channel: GuildTextBasedChannel]
    ban: [Ban: { autocomplete: boolean, targetId: string, authorId: string, reason?: string, messageDeleteDays?: number }, _channel: GuildTextBasedChannel]
    messageClear: [Clear: { channelId: string, authorId: string, request: number, deleted: number }, _channel: GuildTextBasedChannel]
    moneyChange: [Money: {type: keyof CurrencyType, moneyType: any, targetId: string, amount: number}]
    userXpChange: [OldUser: {userId: string, xp: number}, NewUser: {userId: string, xp: number}, _channel: GuildTextBasedChannel]
    skinAdd: [Data: {userId: string, heroId: HeroId, skinId: string}, _channel: GuildTextBasedChannel]
}

const listeners = new Collection<keyof CustomEvents, Array<(...args: Response<CustomEvents[keyof CustomEvents]>) => Awaited<void>>>()
export class CustomEvent {
    constructor(readonly guild: Guild, readonly mongoGuild?: MongoGuild) {
    }

    emit<E extends keyof CustomEvents, T extends CustomEvents[E]>(event: E, ...data: T) {
        const a = data[0]
        const thisEvent = listeners.get(event);
        if (!thisEvent) return;
                (thisEvent as any[]).forEach(fn => fn({guild: this.guild || null, mongoGuild: this.mongoGuild || null, isGuildPremium: this.mongoGuild && this.mongoGuild.premiumUntil ? this.mongoGuild.premiumUntil > new Date() : false}, ...data, new Date()))
    }

    static on<E extends keyof CustomEvents>(event: E, callback: (...args: Response<CustomEvents[E]>) => Awaited<void>) {
        const thisEvent = listeners.get(event);
        if (!thisEvent) {
            listeners.set(event, [callback as any])
        } else {
            listeners.set(event, [...thisEvent, callback] as any)
        }
    }
}

