import { stripIndents } from "common-tags";
import { FightTemplate } from "../../custom-modules/fight-template";
import { Levels } from "../../custom-modules/Level-xp";
import { HeroXpAfterWin, RateMoney, UserXpAfterWin, XpEmoji } from "../../docs/CommandSettings";
import { Hero } from "../../heroes/Heroes";
import { Currency } from "../../structures/Currency";
import { DateTime } from "../../structures/Date";
import { Pagination } from "../../structures/Pagination";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

const _rate_limit_ = new Set<string>();

export default new SlashCommand({
    id: "rating",
    category: "Game",
    isRewardAllowed: true,
    autocomplete: "my-heroes",
    data: new SlashBuilder()
        .setName("rating")
        .setDescription("Рейтинговые бои, для поднятие уровня")
        .addStringOption(o => o
            .setName("hero")
            .setDescription("Ваш Герой для битв")
            .setRequired(true)
            .setAutocomplete(true)),
    async execute({ interaction, options, Builder, F, Heroes, thisUserGame, thisUser, CustomEvent, Database, client }) {
        const heroName = options.getString("hero");
        const hero = Heroes.find(heroName);
        if (_rate_limit_.has(interaction.user.id)) return Builder.createError("Похоже, вы уже находитесь в битве..", interaction.user).interactionReply(interaction);
        if (F.isLimited(thisUser.cooldowns.rating)) return Builder.createEmbed().setUser(interaction.user).setError(`Похоже, вы недавно отказались участвовать в боях, попробуйте снова через **${new DateTime(thisUser.cooldowns.rating).formatTime()}**.`).interactionReply(interaction);
        
        if (!hero || !thisUserGame.heroes[hero.id]) return Builder.createError("Герой не найден!", interaction.user).interactionReply(interaction);
        const mongoHero = thisUserGame.heroes[hero.id];
        const skin = Heroes.findSkin(hero.id, mongoHero.skin);

        const enemies: Hero[] = [];
        for (let i = 0; i < 3; i++) {
            let randomed = Heroes.data.random();
            while (enemies.some(s => s.id === randomed.id)) randomed = Heroes.data.random();
            enemies.push(randomed.clone());
        }

        let embeds = [];
        let attachments = [];
        let otherButtons: Pagination['otherButtons'] = [];

        enemies.forEach((hd, index) => {
            let randomPercent = client.util.random(1, 50);
            hd.attr.addPercentToEach(client.util.random(1, 100) > 50 ? -randomPercent : randomPercent);
            hd.attr.setLevel(Levels.levelFor(mongoHero.xp))
            const attHero = hd.avatarAttachment();

            attachments.push(attHero);
            embeds.push(
                Builder.createEmbed()
                    .setTitle("Выберите противника")
                    .setImage(`attachment://${attHero.name}`)
                    .setUser(interaction.user, "author")
                    .setText(stripIndents`
                    **Ваш Герой: ${hero.elements} ${hero} (Облик: ${skin.name})**
                    ${Heroes.attr(hero.id, mongoHero)}`)
                    .addField("Противник", stripIndents`
                    ${hd.elements} ${hd}
                    ${hd.attr}`)
                    .setFooter("У вас 45 секунд, при отказе получите кулдаун.")
                    .toEmbedBuilder()
            )
            otherButtons.push(
                {
                    end: true,
                    button: Builder.createButton()
                        .setCustomId(`chosenHero$$${index}`)
                        .setStyle("Primary")
                        .setLabel("Выбрать")
                        .toButtonBuilder(),
                    onclick: async (i) => {
                        const att = await FightTemplate.duel(hero.avatarAttachment(skin.id).attachment as any, hd.avatarAttachment().attachment as any);
                        const msg = await Builder.createEmbed()
                            .setTitle(`Рейтинговая Битва`)
                            .setColor(Heroes.getSkinColor(skin))
                            .setImage(`attachment://${att.name}`)
                            .addField(`(Вы) ${hero.elements} ${hero} (\`${F.formatNumber(Levels.levelFor(mongoHero.xp))} lvl\`)`, `**${skin.name}**\n${Heroes.attr(hero.id, mongoHero)}`, true)
                            .addField(`${hd.elements} ${hd}`, `${hd.attr}`, true)
                            .sendToChannel(interaction.channel, { files: [att] });

                        const result = Heroes.fight({ noSkinBonus: true, anyId: interaction.user.id, id: hero.id, attr: Heroes.attr(hero.id, mongoHero), skin: skin.id }, { anyId: "enemy", id: hd.id, attr: hd.attr, skin: hd.id });
                        setTimeout(async () => {hd
                            _rate_limit_.delete(interaction.user.id)

                            if (result.winner.anyId === "enemy") {
                                Builder.createEmbed()
                                    .setTitle(`Рейтинговая Битва`)
                                    .addField(`(Вы) ${hero.elements} ${hero} (\`${F.formatNumber(Levels.levelFor(mongoHero.xp))} lvl\`)`, `**${skin.name}**\n${Heroes.attrFrom(result.loser.attr)}`, true)
                                    .addField(`${hd.elements} ${hd}`, `${Heroes.attrFrom(result.winner.attr)}`, true)
                                    .setError("Вы проиграли.")
                                    .setColor(Heroes.getSkinColor(skin))
                                    .messageReply(msg);
                                await Promise.all([
                                    Database.addGame(interaction.user.id, hero.id),
                                ])
                            } else {
                                const xp = F.percentOf(UserXpAfterWin(), 80);
                                const money = RateMoney();
                                Builder.createEmbed()
                                    .setTitle(`Рейтинговая Битва`)
                                    .setSuccess("Вы Выиграли.")
                                    .setColor(Heroes.getSkinColor(skin))
                                    .addField(`(Вы) ${hero.elements} ${hero} (\`${F.formatNumber(Levels.levelFor(mongoHero.xp))} lvl\`)`, `**${skin.name}**\n${Heroes.attrFrom(result.winner.attr)}`, true)
                                    .addField(`${hd.elements} ${hd}`, `${Heroes.attrFrom(result.loser.attr)}`, true)
                                    .addField(`Награда`, F.andOr([`${XpEmoji} ${F.formatNumber(xp)}`, `${Currency.types.user.secondary} ${F.formatNumber(money)}`]))
                                    .messageReply(msg);
                                await Promise.all([
                                    Database.addUserXp(interaction.user.id, xp, CustomEvent, interaction.channel),
                                    Database.addHeroXp(interaction.user.id, hero.id, HeroXpAfterWin()),
                                    Database.changeMoney({targetId: interaction.user.id, amount: money, type: "user", moneyType: "secondary", CustomEvent}),
                                    Database.addGame(interaction.user.id, hero.id, true),
                                ]);
                            }
                        }, 10 * 1000)
                    }
                }
            )
        })

        
        new Pagination({interaction, embeds, timeout: 45 * 1000 , otherButtons, attachments, validIds: [interaction.user.id], endCallback: async (time) => {  
            if (!time) {
                await Database.get("User").updateOne({ _id: interaction.user.id }, { $set: { [`cooldowns.rating`]: new Date(Date.now() + 1000 * 60 * 3) } });
                _rate_limit_.delete(interaction.user.id)
            }
    }, startCallback: () =>  _rate_limit_.add(interaction.user.id)}).createSimplePagination()

    }
})