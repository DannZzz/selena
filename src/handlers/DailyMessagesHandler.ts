import { Guild } from "discord.js";
import { client } from "..";
import Database from "../database/db";
import { Everyday } from "../structures/Everyday"
import { Functions } from "../structures/Functions";

export class DailyMessagesHandler {
    everyday: Everyday;
    constructor () {
        this.createAndStart();
    }

    async createAndStart () {
        const settings = await Database.get("Settings").findOrCreate("_id", "main");
        this.everyday = new Everyday()
            .setCheckTime("00")
            .setDate(settings.lastDailyTime || new Date())
            .setInterval(10 * 1000 * 60)
            .setTimeZone("ru-ru", {timeZone: "Europe/Moscow"})
            .setOneTimeInDay(this.oneTime)
            .setUpdateBase(async (date) => {
                await Database.get("Settings").updateOne({_id: "main"}, {$set: {lastDailyTime: date}});
            })
            .start()
    }

    async oneTime () {
        const ag = await Database.get("Guild").findMany({usersMessagesDaily: {$ne: []}});
        for (let guild of ag) {
            let _guild: Guild = null;
            try {
                _guild = await client.guilds.fetch(guild._id);
            } catch{}
            if (!_guild) continue;
            const members = await (Functions).fetchCollection(_guild, "members");
            const all = Object.entries(guild.usersMessagesDaily);
            if (all.length === 0) continue;
            const theMost = all.sort((a, b) => b[1].messages - a[1].messages)[0];
            const amount = theMost[1].messages > members.size ? members.size : theMost[1].messages;
            await Database.get("User").updateOne({_id: theMost[0]}, {$inc: {money: Math.round(amount)}});
        }
        await Database.get("Guild").updateMany({}, {$set: {usersMessagesDaily: {}}})
    }

}