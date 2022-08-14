import {  Guild, GuildTextBasedChannel, TextChannelResolvable } from "discord.js"
import { Guild as MongoGuild } from "../database/models/Guild"

export type Response<T extends ReadonlyArray<any> | Array<T>> = [{guild?: Guild, mongoGuild?: MongoGuild, isGuildPremium?: boolean}, ...T, Date, GuildTextBasedChannel?] 

export interface Mute {
    targetId: string
    moderatorId: string
    reason?: string
    duration: number
    autocomplete: boolean
}

export interface Punishment {
    targetId: string
    moderatorId: string
    createdAt: Date
    reason?: string
    until?: Date
    removed?: boolean
    case: number
    autocomplete: boolean
}

export interface PunishmentAction {
    type: "mute" | "kick" | "ban"
    amount: number
    muteDuration?: string
}