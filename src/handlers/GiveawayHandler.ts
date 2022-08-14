import { stripIndents } from "common-tags";
import { Collection, Formatters, Message, User } from "discord.js";
import { client } from "..";
import Database from "../database/db";
import { GiveawayEmoji } from "../docs/CommandSettings";
import { DiscordComponentBuilder } from "../structures/DiscordComponentBuilder";
import { Functions } from "../structures/Functions";
import { Loop } from "../structures/Loop";

export class GiveawayHandler {
    constructor () {
        this.start();
    }

    private start() {
        new Loop()
        .setInterval(30 * 1000)
        .setFunction(this.check)
        .start();
    }

    private async check () {
        const ended = await Database.get("Giveaway").findMany({endsAt: {$lt: new Date()}});
        if (ended.length === 0) return;
        for (let g of ended) {
           let guild = client.guilds.cache.get(g.guildId)
           try {
                guild = await client.guilds.fetch(g.guildId)
            } catch {}
            if (!guild) continue;
            let channel = guild.channels.cache.get(g.channelId);
            try {
                channel = await guild.channels.fetch(g.channelId);
            } catch {}
            if (!channel || !channel.isTextBased()) continue;
            let message: Message = null;
            try {
                message = await channel.messages.fetch(g._id);
            } catch {}
            if (!message) continue;
            const users = (await (message.reactions.cache.get(GiveawayEmoji as any).users.fetch())).filter(p => !p.bot);

            
            
            if (users.size === 0) {
                const emb = new DiscordComponentBuilder().createEmbed().setTitle("Статус: Закончен").setThumbnail(client.user.avatarURL()).setText(stripIndents`
                • Победители: Никто не участвовал
                • Автор: <@${g.authorId}>
                ${g.reward ? `• Приз: ${g.reward}` : ""}
                `).toEmbedBuilder();
                message.edit({embeds: [emb]});
                message.reply(`Никто не участвовал.`)
            } else if (users.size <= g.winners) {
                const emb = new DiscordComponentBuilder().createEmbed().setTitle("Статус: Закончен").setThumbnail(client.user.avatarURL()).setText(stripIndents`
                • Победители: ${users.map(user => `<@${user.id}>`).join("\n")}
                • Автор: <@${g.authorId}>
                ${g.reward ? `• Приз: ${g.reward}` : ""}
                `).toEmbedBuilder();
                message.edit({embeds: [emb]});
                message.reply({content: `🎉 Победители: ${users.map(user => `<@${user.id}>`).join("\n")}`});
            } else {
                let winners = randomWinners(g.winners, users);
                const emb = new DiscordComponentBuilder().createEmbed().setTitle("Статус: Закончен").setThumbnail(client.user.avatarURL()).setText(stripIndents`
                • Победители: ${winners.map(user => `<@${user.id}>`).join("\n")}
                • Автор: <@${g.authorId}>
                ${g.reward ? `• Приз: ${g.reward}` : ""}
                `).toEmbedBuilder();
                message.edit({embeds: [emb]});
                message.reply({content: `🎉 Победители: ${winners.map(user => `<@${user.id}>`).join("\n")}`});
            }
            await Database.get("Giveaway").deleteOne({_id: g._id, channelId: g.channelId, guildId: g.guildId});
        
        }
        

    }
}

export function randomWinners (count: number, users: Collection<string, User>): User[] {
    let toSend: User[] = [];
    for (let i = 0; i < count; i++) {
        let pl = random();
        while (toSend.find(p => p.id === pl.id)) pl = random();
        toSend.push(pl);
    }
    function random () {return users.random()};
    return toSend;
}