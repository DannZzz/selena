import { stripIndents } from "common-tags";
import { Currency } from "../../structures/Currency";
import { Pagination } from "../../structures/Pagination";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand({
    id: "messages-top",
    category: "Information",
    data: new SlashBuilder()
        .setName("messages-top")
        .setDescription("Открыть топ по отправленных сообщений сервера")
    ,
    async execute ({interaction, options, Builder, Database, thisGuild, client, F}) {
        const embeds = [];
        const entries = Object.entries(thisGuild.usersMessagesDaily || {}).sort((a, b) => b[1].messages - a[1].messages);
        for (let i = 0; i < entries.length; i += 10) {
            const sliced = entries.slice(i, i+10);
            embeds.push(
                Builder.createEmbed().setTitle(`Топ по сообщений за сегодня`).setAuthor(interaction.guild.name, interaction.guild.iconURL()).setThumbnail(client.user.avatarURL())
                    .setText(stripIndents`В конце дня, участник на первом месте получит ${Currency.types.user.secondary} в сумме его отправленных сообщений, но не больше чем количество участников сервера.\n\n${sliced.map(([id, data]) => `**${entries.findIndex(arr => arr[0] === id)+1}.** <@${id}> — ${F.formatNumber(data.messages)}`).join("\n")}`)
                    .toEmbedBuilder()
            )
        }

        if (embeds.length === 0) embeds.push(
            Builder.createEmbed().setTitle(`Топ по сообщений за сегодня`).setAuthor(interaction.guild.name, interaction.guild.iconURL()).setThumbnail(client.user.avatarURL())
                .setText(stripIndents`В конце дня, участник на первом месте получит ${Currency.types.user.secondary} в сумме его отправленных сообщений, но не больше чем количество участников сервера.`)
                .toEmbedBuilder()
        );

        new Pagination({embeds, interaction, validIds: [interaction.user.id]}).createAdvancedPagination();
    }
})