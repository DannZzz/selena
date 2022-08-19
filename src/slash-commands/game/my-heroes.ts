import { Levels } from "../../custom-modules/Level-xp";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { Pagination } from "../../structures/Pagination";
import { HeroSkinRarityNames } from "../../heroes/heroes-attr";

export default new SlashCommand ({
    id: "my-heroes",
    category: "Game",
    data: new SlashBuilder()
        .setName("my-heroes")
        .setDescription("Посмотреть своих героев"),
    async execute ({Heroes, interaction, thisUserGame, Builder, F}) {
        const embeds = [];
        const attachments = []
        const count = Object.keys(thisUserGame.heroes || {}).length;
        Object.entries(thisUserGame.heroes || {}).forEach(([heroId, mongoHero]) => {
            const hero = Heroes.find(heroId);
            if (!hero) return;
            const _games = mongoHero.games || 0;
            const _wins = mongoHero.wins || 0;
            const att = hero.avatarAttachment(mongoHero.skin);
            attachments.push(att);
            embeds.push(Builder.createEmbed()
                .setThumbnail(`attachment://${att.name}`)
                .setAuthor(`Всего героев: ${F.formatNumber(count)}`)
                .setTitle(`Герой: ${hero.elements} ${hero}\n${HeroSkinRarityNames[Heroes.findSkin(heroId, mongoHero.skin).rarity]} Облик: ${Heroes.findSkin(heroId, mongoHero.skin).name}`)
                .setColor(Heroes.getSkinColor(Heroes.findSkin(heroId, mongoHero.skin )))
                .setText(hero.description, true)
                .addField("Уровень", F.levelFormat(mongoHero.xp || 0))
                .addField("Активность", `Всего игр: ${F.formatNumber(_games)}\nВсего побед: ${F.formatNumber(_wins)} (${_games === 0 ? "0.0" : (Math.round(_wins / _games * 100)).toFixed(1)}%)`)
                .addField("Характеристики", `${Heroes.attr(heroId, mongoHero)}`)
                .toEmbedBuilder())
        })

        if (embeds.length === 0) embeds.push(
            Builder.createEmbed()
            .setColor()
            .setTitle(`У вас ещё нет героев..`)
            .toEmbedBuilder()
        )

        new Pagination({interaction, validIds: [interaction.user.id], embeds, attachments}).createAdvancedPagination();
        
    }
})