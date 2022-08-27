import { stripIndents } from "common-tags";
import { AttachmentBuilder } from "discord.js";
import { FightTemplate } from "../../custom-modules/fight-template";
import { SkinLimits } from "../../docs/limits";
import { HeroRarityColor, HeroSkinRarityNames } from "../../heroes/heroes-attr";
import { Packs } from "../../heroes/Packs";
import { Pagination } from "../../structures/Pagination";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "events",
    category: "Game",
    data: new SlashBuilder()
        .setName("events")
        .setDescription("Посмотреть ивенты"),
    async execute ({interaction, Heroes, Database, F, Builder, client}) {
        await interaction.deferReply()
        const embeds = [];
        const otherButtons = [];
        const attachments = [];
        const att = Heroes.find("Atilla").avatarAttachment("moon-lord");

        attachments.push(att);
        embeds.push(
            Builder.createEmbed()
                .setImage(`attachment://${att.name}`)
                .setTitle("Лунное Обновление")
                .setColor(HeroRarityColor.moon)
                .addField("Новые 6 лунные облики уже доступны!", `${Heroes.filterSkin("moon").heroes.map(h => `Облик **${h.skins.find(s => s.rarity === "moon")?.name}** на героя ${h}`).join("\n")}`)
                .addField("Новый Пак", `${Packs.find("moon_pack")}\n\nПобеды в боях дают 2% шанса получать этот пак!`)
                .addField("Новый Ивент", `Соберите все лунные облики, и получите Облик **${Heroes.findSkin("Atilla", "moon-lord").name}** на героя **${Heroes.find("Atilla")}** бесплатно!`)
                .addField("Длительность Ивента", `${F.isLimited(SkinLimits.moon) ? `Закончится ${F.moment(SkinLimits.moon).fromNow()}` : "Закончено"}`)
                .toEmbedBuilder()
        )

        // elena skins
        const ma = Heroes.findSkin("Elena", "mars-adventure");
        const qe = Heroes.findSkin("Elena", "queen-of-angels");
        const att1 = new AttachmentBuilder((await FightTemplate.list({borderColor: "#abc2fa", backgroundImage: "https://kartinkin.net/uploads/posts/2021-07/1626957676_37-kartinkin-com-p-nezhnii-fon-nebo-krasivo-37.jpg"}, [Heroes.find("Elena").avatarAttachment("mars-adventure").attachment as any, Heroes.find("Elena").avatarAttachment("queen-of-angels").attachment as any])).toBuffer(), {name: "skins1.png"})
        attachments.push(att1);
        embeds.push(
            Builder.createEmbed()
                .setImage(`attachment://${att1.name}`)
                .setTitle("Новые облики на героя " + Heroes.find("Elena"))
                .setText(`${HeroSkinRarityNames[ma.rarity]} Облик **${ma.name}**\n${HeroSkinRarityNames[qe.rarity]} Облик **${qe.name}**`)
                .toEmbedBuilder()
        )
        
        new Pagination({editReply: true, interaction, validIds: [interaction.user.id], otherButtons, embeds, attachments}).createSimplePagination()
    }
})