import { Levels } from "../../custom-modules/Level-xp";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { Pagination } from "../../structures/Pagination";

export default new SlashCommand ({
    id: "heroes",
    category: "Game",
    data: new SlashBuilder()
        .setName("heroes")
        .setDescription("Посмотреть всех героев")
        .addSubcommand(s => s
            .setName("list")
            .setDescription("Посмотреть список героев и их статистику"))
        .addSubcommand(s => s
            .setName("page")
            .setDescription("Посмотреть героев в формате страниц")),
    async execute ({Heroes, interaction, thisUserGame, Builder, F, options}) {
        const cmd = options.getSubcommand();
        if (cmd === "list") {
            const embeds = [];
            const texts = Heroes.sort().map((hero, heroId) => {
                return `${hero.emojied()} (${hero.elements}) — ${`${hero.attr}`.replaceAll("\n", " ")}`
            })
    
            for (let i = 0; i < texts.length; i += 25) {
                const sliced = texts.slice(i, i + 25)
                embeds.push(Builder.createEmbed()
                .setAuthor(`Всего героев: ${F.formatNumber(Heroes.data.size)}`)
                .setText(sliced.join("\n\n"))
                .setUser(interaction.user)
                .toEmbedBuilder())
            }
    
            if (embeds.length === 0) embeds.push(
                Builder.createEmbed()
                .setColor()
                .setUser(interaction.user)
                .setTitle(`Ещё нет героев..`)
                .toEmbedBuilder()
            )
    
            new Pagination({interaction, validIds: [interaction.user.id], embeds}).createSimplePagination();
        } else if (cmd === "page") {
            const embeds = [];
            const attachments = [];

            Heroes.sort().map((hero, heroId) => {
                const att = hero.avatarAttachment();
                attachments.push(att)
                embeds.push(
                    Builder.createEmbed()
                        .setThumbnail(`attachment://${att.name}`)
                        .setAuthor(`Герой: ${hero.elements} ${hero}`)
                        .setText(hero.description)
                        .addField("Коллекции", Heroes.collections.heroCollections(hero.id)?.map(c => c.emoji)?.join(" ") || "Не находится в коллекций")
                        .setColor(Heroes.getSkinColor(Heroes.findSkin(hero.id, hero.id)))
                        .addField("Характеристики", `${hero.attr}`)
                        .addField("Цена", `${hero.cost}`)
                        .toEmbedBuilder()
                )
            })

            new Pagination({interaction, validIds: [interaction.user.id], embeds, attachments}).createAdvancedPagination();
        }
        
    }
})