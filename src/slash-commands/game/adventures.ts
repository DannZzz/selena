import { FightTemplate } from "../../custom-modules/fight-template";
import { Levels } from "../../custom-modules/Level-xp";
import { HeroXpAfterWin, UserXpAfterWin, XpEmoji } from "../../docs/CommandSettings";
import { Adventures } from "../../heroes/Adventures";
import { HeroSkinRarityNames } from "../../heroes/heroes-attr";
import { Currency } from "../../structures/Currency";
import { DateTime } from "../../structures/Date";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
const _rate_limit_ = new Set<string>();

export default new SlashCommand({
    id: "adventures",
    category: "Game",
    isRewardAllowed: true,
    autocomplete: "my-heroes",
    data: new SlashBuilder()
        .setName("adventures")
        .setDescription("Приключения")
        .addSubcommand(s => s
            .setName("level")
            .setDescription("Посмотреть врага"))
        .addSubcommand(s => s
            .setName("attack")
            .setDescription("Атаковать врага")
            .addStringOption(o => o
                .setName("hero")
                .setRequired(true)
                .setDescription("Выберите героя")
                .setAutocomplete(true)))
        ,
    async execute ({interaction, options, thisUserGame, thisUser, Database, F, Builder, Heroes, CustomEvent}) {
        const cmd = options.getSubcommand();
        const heroName = options.getString("hero");
        const advLevel = thisUserGame.adventures + 1;

        const enemy = Adventures.enemyFor(advLevel);
        if (!enemy) return Builder.createEmbed().setUser(interaction.user).setText("Поздравляем, вы закончили все испытания!\n\nНовые уровни скоро!").interactionReply(interaction);
        const enemyHero = Heroes.find(enemy.id);
    
        if (cmd === "level") {
            const skin = Heroes.findSkin(enemyHero.id, enemyHero.id);
            const att = enemyHero.avatarAttachment(skin.id);
            Builder.createEmbed()
                .setThumbnail(`attachment://${att.name}`)
                .setAuthor(`Герой: ${enemyHero.elements} ${enemyHero}`)
                .setTitle(`Уровень: ${advLevel}`)
                .setColor(Heroes.getSkinColor(skin))
                .addField("Характеристики", `${enemy.attr}`)
                .addField("Награда", `${enemy.rewardString}`)
                .interactionReply(interaction, {files: [att]})
        } else if (cmd === "attack") {
        if (_rate_limit_.has(interaction.user.id)) return Builder.createError("Похоже, вы уже находитесь в приключениях..", interaction.user).interactionReply(interaction);
            if (F.isLimited(thisUser.cooldowns.adventures)) return Builder.createEmbed().setUser(interaction.user).setError(`Попробуйте снова через **${new DateTime(thisUser.cooldowns.adventures).formatTime()}**.`).interactionReply(interaction);
            const hero = Heroes.find(heroName);
            if (!hero) return Builder.createEmbed().setUser(interaction.user).setError("Герой не найден!").interactionReply(interaction);
            
            const mongoHero = thisUserGame.heroes[hero.id];
    
            if (!mongoHero) return Builder.createEmbed().setUser(interaction.user).setError("Герой не имеется!").interactionReply(interaction);
            const skin = Heroes.findSkin(hero.id, mongoHero.skin);
            
            await interaction.deferReply();

            const att = await FightTemplate.duel(hero.avatarAttachment(mongoHero.skin).attachment as any, enemyHero.avatarAttachment().attachment as any);
            const msg = await Builder.createEmbed()
                .setTitle(`Приключения | Уровень ${advLevel}`)
                .setColor(Heroes.getSkinColor(skin))
                .setImage(`attachment://${att.name}`)
                .addField(`(Вы) ${hero.elements} ${hero} (\`${F.formatNumber(Levels.levelFor(mongoHero.xp))} lvl\`)`, `**${skin.name}**\n${Heroes.attr(hero.id, mongoHero)}`, true)
                .addField(`${enemyHero.elements} ${enemyHero}`, `${enemy.attr}`, true)
                .editReply(interaction, {files: [att]});
            _rate_limit_.add(interaction.user.id);
            const result = Heroes.fight({noSkinBonus: true, anyId: interaction.user.id, id: hero.id, attr: Heroes.attr(hero.id, mongoHero), skin: skin.id}, {anyId: "enemy", id: enemyHero.id, attr: enemy.attr, skin: enemyHero.id});
            setTimeout(async () => {
                _rate_limit_.delete(interaction.user.id);
                if (result.winner.anyId === "enemy") {
                    Builder.createEmbed()
                    .setTitle(`Приключения | Уровень ${advLevel}`)
                        .addField(`(Вы) ${hero.elements} ${hero} (\`${F.formatNumber(Levels.levelFor(mongoHero.xp))} lvl\`)`, `**${skin.name}**\n${Heroes.attrFrom(result.loser.attr)}`, true)
                        .addField(`${enemyHero.elements} ${enemyHero}`, `${Heroes.attrFrom(result.winner.attr)}`, true)
                        .setError("Вы проиграли.")
                        .setColor(Heroes.getSkinColor(skin))
                        .interactionFollowUp(interaction);
                    await Promise.all([
                        Database.addGame(interaction.user.id, hero.id, false, interaction.channel),
                        Database.get("User").updateOne({_id: interaction.user.id}, {$set: {[`cooldowns.adventures`]: new  Date(Date.now() + 1000 * 60 * 5)}})
                    ])
                } else {
                    const xp = UserXpAfterWin();
                    Builder.createEmbed()
                        .setTitle(`Приключения | Уровень ${advLevel}`)
                        .setSuccess("Вы выиграли.")
                        .setColor(Heroes.getSkinColor(skin))
                        .addField(`(Вы) ${hero.elements} ${hero} (\`${F.formatNumber(Levels.levelFor(mongoHero.xp))} lvl\`)`, `**${skin.name}**\n${Heroes.attrFrom(result.winner.attr)}`, true)
                        .addField(`${enemyHero.elements} ${enemyHero}`, `${Heroes.attrFrom(result.loser.attr)}`, true)
                        .addField(`Награда`, [`${XpEmoji} ${F.formatNumber(xp)}`, `${enemy.rewardString}`].join(", "))
                        .interactionFollowUp(interaction);
                    await Promise.all([
                        Database.addUserXp(interaction.user.id, xp, CustomEvent, interaction.channel),
                        Database.addHeroXp(interaction.user.id, hero.id, HeroXpAfterWin()),
                        Database.addGame(interaction.user.id, hero.id, true, interaction.channel),
                        enemy.giveReward(interaction.user.id, CustomEvent),
                        Database.get("Game").updateOne({_id: interaction.user.id}, {$inc: {adventures: 1}}),
                        Database.get("User").updateOne({_id: interaction.user.id}, {$set: {[`cooldowns.adventures`]: new  Date(Date.now() + 1000 * 60 * 2)}})
                    ]);
                }
            }, 10 * 1000)
        }
    }
})