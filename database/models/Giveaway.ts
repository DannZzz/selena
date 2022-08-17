import mongoose from "mongoose";
import { ObjectType } from "../../structures/MainTypes";

export interface Giveaway {
    _id: string
    guildId: string
    channelId: string
    endsAt: Date
    winners: number
    reward?: string
    authorId: string
}

export const Giveaway = mongoose.model("giveaway", new mongoose.Schema<Giveaway>({
    _id: String,
    guildId: String,
    channelId: String,
    endsAt: Date,
    winners: Number,
    reward: String,
    authorId: String,
}))

export const GiveawayKeys: readonly (keyof Giveaway)[] = ["_id", "guildId", "channelId", "endsAt", "winners", "reward", "authorId"];
export const GiveawayKeysApi: readonly (keyof Giveaway)[] = ["_id", "guildId", "channelId", "endsAt", "winners", "reward", "authorId"];