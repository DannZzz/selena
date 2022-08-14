import { Levels } from "../../custom-modules/Level-xp";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { Pagination } from "../../structures/Pagination";

export default new SlashCommand ({
    id: "heroes",
    category: "Game",
    data: new SlashBuilder()
        .setName("heroes")
        .setDescription("Посмотреть всех героев"),
    async execute ({Heroes, interaction, thisUserGame, Builder, F}) {
        const embeds = [];
        const texts = Heroes.data.map((hero, heroId) => {
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
        
    }
})