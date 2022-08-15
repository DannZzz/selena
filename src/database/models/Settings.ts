import mongoose from "mongoose";
import { ObjectType } from "../../structures/MainTypes";

export interface Settings {
    _id: string
    lastDailyTime: Date
    apiTokens: string[]
}

export const Settings = mongoose.model("settings", new mongoose.Schema<Settings>({
    _id: String,
    lastDailyTime: { type: Date, default: Date.now },
    apiTokens: { type: Array as any, default: [] }
}))

export const SettingsKeys: readonly (keyof Settings)[] = ["_id", "lastDailyTime", "apiTokens"];
export const SettingsKeysApi: readonly (keyof Settings)[] = ["_id", "lastDailyTime"];