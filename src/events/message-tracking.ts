import { Event } from "../structures/Event";
import { Limiter } from "client-discord";
import Database from "../database/db";
import { UserData } from "../database/models/Guild";

const messageLimiter = new Limiter(6, 10000);

export default new Event({
    event: "messageCreate",
    async execute (client, msg) {
        if (!msg || !msg.guild || msg.author.bot) return;
        const limited = messageLimiter.take(`${msg.guildId}-${msg.author.id}`);
        if (limited) return;
        const guilds = Database.get("Guild");
        const thisGuild = await guilds.findOrCreate("_id", msg.guildId);

        const thisUser: UserData = thisGuild.usersMessages[msg.author.id] || {messages: 0};
        const thisUserDaily: UserData = thisGuild.usersMessagesDaily[msg.author.id] || {messages: 0};
        thisUser.messages++;
        thisUserDaily.messages++;
        guilds.updateOne({_id: msg.guildId}, {$set: {[`usersMessages.${msg.author.id}`]: thisUser, [`usersMessagesDaily.${msg.author.id}`]: thisUserDaily}})
    }
})