import { stripIndents } from "common-tags";
import { ChannelType, Collection, Formatters, GuildBan, NonThreadGuildBasedChannel } from "discord.js";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "server-info",
    category: "Information",
    data: new SlashBuilder()
        .setName("server-info")
        .setDescription("Информация о сервере")
    ,
    async execute ({client, Builder, interaction, thisGuild, isGuildPremium, F}) {
        await interaction.deferReply()
        const server = interaction.guild;
        let channels: Collection<string, NonThreadGuildBasedChannel> = null;
        let bans: Collection<string, GuildBan> = null;
        try {
            bans = await server.bans.fetch();
        } catch {}
        try {
            channels = await server.channels.fetch()
        } catch {}
        Builder.createEmbed()
            .setColor()
            .setThumbnail(server.iconURL())
            .setImage(server.bannerURL())
            .setTitle(server.name)
            .setText(stripIndents`
            Серверные эссенции: ${F.toMoneyString(thisGuild.secondary, "guild", "secondary")}

            🌟 Премиум: ${isGuildPremium ? `до ${Formatters.time(thisGuild.premiumUntil)}` : "Отсутствует"}

            👑 Владелец: <@${server.ownerId}>

            📅 Создано в: ${Formatters.time(server.createdAt)}

            ${channels ? `📜 Категории: ${F.formatNumber(channels.filter(c => c.type === ChannelType.GuildCategory).size)}

            #️⃣ Текстовые каналы: ${F.formatNumber(channels.filter(c => [ChannelType.GuildNews, ChannelType.GuildText, ChannelType.GuildForum].includes(c.type)).size)}

            🔊 Голосовые каналы: ${F.formatNumber(channels.filter(c => c.type === ChannelType.GuildVoice || c.type === ChannelType.GuildStageVoice).size)}` : ""}
            
            ${bans ? `🔨 Баны: ${F.formatNumber(bans.size)}` : ""}
            `)
            .editReply(interaction)
    }
})