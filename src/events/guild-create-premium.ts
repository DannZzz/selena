import { OneDayMs } from "../config";
import Database from "../database/db";
import { FreePremiumGuildDays } from "../docs/CommandSettings";
import { Event } from "../structures/Event";

export default new Event ({
    event: "guildCreate",
    async execute (client, guild) {
        if (!guild || Object.keys(guild).length === 0 || !guild.id) return;


        const sd = await Database.get("Guild").findOne("_id", guild.id);
        if (sd) return;
        
        await Database.get("Guild").createOne({_id: guild.id, premiumUntil: new Date(OneDayMs * FreePremiumGuildDays + Date.now())});
    }
})