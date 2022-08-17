import mongoose from "mongoose";
import { PackId } from "../../heroes/Packs";
import { ObjectType } from "../../structures/MainTypes";

export type UserCooldownKeys = "daily" | "adventures" | "rating" | "nicknameChange";
export interface User {
    _id: string
    secondary?: number
    primary?: number
    cooldowns?: ObjectType<UserCooldownKeys, Date>
    vipUntil?: Date
    packs?: ObjectType<PackId, number, true>
}

export const User = mongoose.model("user", new mongoose.Schema<User>({
    _id: String,
    secondary: { type: Number, default: 0 },
    primary: { type: Number, default: 0 },
    cooldowns: { type: Object, default: {} },
    packs: { type: Object, default: {} },
    vipUntil: { type: Date, default: null }
}))

export const UserKeys: readonly (keyof User)[] = ["_id", "secondary", "cooldowns", "primary", "vipUntil", "packs"];
export const UserKeysApi: readonly (keyof User)[] = ["_id"];