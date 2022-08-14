import { stripIndents } from "common-tags";
import { ContextMenuCommandBuilder } from "discord.js";
import { GiveawayEmoji } from "../docs/CommandSettings";
import { randomWinners } from "../handlers/GiveawayHandler";
import { ContextMenuBuilder, ContextMenuCommand } from "../structures/ContextMenuCommand";

export default new ContextMenuCommand ({
    id: "end-giveaway",
    data: new ContextMenuBuilder("ManageGuild")
        .setName("end-giveaway")
        .setType(3),
    async execute ({interaction, targetMessage, Builder, client, Database}) {
        const g = await Database.get("Giveaway").findOneFilter({_id: targetMessage.id, channelId: interaction.channelId, guildId: interaction.guildId});
        if (!g) return Builder.createEmbed().setUser(interaction.user).setError("Розыгрыш не найден!").interactionReply(interaction, {ephemeral: true});
        const users = (await targetMessage.reactions.cache.get(GiveawayEmoji as any).users.fetch()).filter(p => !p.bot)
        const message = targetMessage;
        if (users.size === 0) {
            const emb = Builder.createEmbed().setTitle(`Статус: Закончен`).setThumbnail(client.user.avatarURL()).setText(stripIndents`
            • Победители: Никто не участвовал
            • Автор: <@${g.authorId}>
            ${g.reward ? `• Приз: ${g.reward}` : ""}
            `).toEmbedBuilder();
            message.edit({embeds: [emb]});
            message.reply(`Никто не участвовал.`)
        } else if (users.size <= g.winners) {
            const emb = Builder.createEmbed().setTitle(`Статус: Закончен`).setThumbnail(client.user.avatarURL()).setText(stripIndents`
            • Победители: ${users.map(user => `<@${user.id}>`).join("\n")}
            • Автор: <@${g.authorId}>
            ${g.reward ? `• Приз: ${g.reward}` : ""}
            `).toEmbedBuilder();
            message.edit({embeds: [emb]});
            message.reply({content: `🎉 Победители: ${users.map(user => `<@${user.id}>`).join("\n")}`});
        } else {
            let winners = randomWinners(g.winners, users);
            const emb = Builder.createEmbed().setTitle(`Статус: Закончен`).setThumbnail(client.user.avatarURL()).setText(stripIndents`
            • Победители: ${winners.map(user => `<@${user.id}>`).join("\n")}
            • Автор: <@${g.authorId}>
            ${g.reward ? `• Приз: ${g.reward}` : ""}
            `).toEmbedBuilder();
            message.edit({embeds: [emb]});
            message.reply({content: `🎉 Победители: ${winners.map(user => `<@${user.id}>`).join("\n")}`});
        }
        await Database.get("Giveaway").deleteOne({_id: g._id, channelId: g.channelId, guildId: g.guildId});
        interaction.reply({content: "Успешно закончен.", ephemeral: true})
    }
        
})