import { stripIndents } from "common-tags";
import { SkinLimits } from "../../docs/limits";
import { HeroRarityColor } from "../../heroes/heroes-attr";
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
        
        
        new Pagination({interaction, validIds: [interaction.user.id], otherButtons, embeds, attachments}).createSimplePagination()
    }
})