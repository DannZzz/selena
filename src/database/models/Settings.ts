import mongoose from "mongoose";
import { ObjectType } from "../../structures/MainTypes";

export interface Settings {
    _id: string
    lastDailyTime: Date
}

export const Settings = mongoose.model("settings", new mongoose.Schema<Settings>({
    _id: String,
    lastDailyTime: { type: Date, default: Date.now }
}))

export const SettingsKeys: readonly (keyof Settings)[] = ["_id", "lastDailyTime"];
export const SettingsKeysApi: readonly (keyof Settings)[] = ["_id", "lastDailyTime"];