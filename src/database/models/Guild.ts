import mongoose from "mongoose";
import { DEFAULT_PREFIX } from "../../config";
import { Punishment, PunishmentAction } from "../../structures/CustomEventTypes";
import { ObjectType } from "../../structures/MainTypes";
import { SlashCommandId } from "../../structures/SlashCommand";

export interface CommandSettings {
    disabledRoles: string[]
    disabledChannels: string[]
    disabledGlobal: boolean
}

export interface UserData {
    messages: number
}

export interface RoleShopItem {
    roleId: string
    cost: number
}

export interface Guild {
    _id: string
    prefix?: string
    commands?: ObjectType<SlashCommandId, CommandSettings>
    punishments?: Punishment[]
    premiumUntil?: Date
    punishmentActions?: PunishmentAction[]
    secondary?: number
    usersMessages?: ObjectType<string, UserData>
    usersMessagesDaily?: ObjectType<string, UserData>
    roleShop?: RoleShopItem[]
    reputation?: number
}

export const Guild = mongoose.model("guild", new mongoose.Schema<Guild>({
    _id: String,
    prefix: { type: String, default: DEFAULT_PREFIX },
    commands: { type: Object, default: {} },
    usersMessages: { type: Object, default: {} },
    usersMessagesDaily: { type: Object, default: {} },
    roleShop: { type: Array as any, default: [] },
    punishments: { type: Array as any, default: [] },
    punishmentActions: { type: Array as any, default: [] },
    premiumUntil: { type: Date, default: null },
    secondary: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 },
}))

export const GuildKeys: readonly (keyof Guild)[] = ["usersMessagesDaily", "reputation", "roleShop", "usersMessages", "secondary", "_id", "commands", "prefix", "premiumUntil", "punishments", "punishmentActions"];
export const GuildKeysApi: readonly (keyof Guild)[] = ["secondary", "premiumUntil", "reputation", "_id"];