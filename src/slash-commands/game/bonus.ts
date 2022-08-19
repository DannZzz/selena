import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";
import { Pagination } from "../../structures/Pagination";
import { stripIndents } from "common-tags";
import { HeroAttribute, HeroAttributesEnum, HeroElementsContrs, HeroElementsNames } from "../../heroes/heroes-attr";
import { Pack, Packs } from "../../heroes/Packs";
import { BonusBuying, DxtDoubleAttackChance, HeroCostIfExists } from "../../docs/CommandSettings";
import { Currency } from "../../structures/Currency";
import { ObjectType } from "../../structures/MainTypes";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { Message } from "discord.js";

const arr = [];

for (let i in HeroAttributesEnum) {
    arr.push([HeroAttributesEnum[i], i])
}

export default new SlashCommand({
    id: "bonus",
    category: "Game",
    autocomplete: "my-heroes",
    data: new SlashBuilder()
        .setName("bonus")
        .setDescription("Бонусные атрибуты")
        .addSubcommand(s => s
            .setName("use")
            .setDescription("Использовать")
            .addStringOption(o => o
                .setName("hero")
                .setDescription("Герой, которого нужно баффнуть")
                .setRequired(true)
                .setAutocomplete(true))
            .addStringOption(o => o
                .setName("attribute")
                .setDescription("Атрибут")
                .setRequired(true)
                .setChoices(...toChoices(arr)))
            .addIntegerOption(o => o
                .setName("amount")
                .setDescription("Количество бонуса")
                .setRequired(true))
            )
        .addSubcommand(s => s
            .setName("buy")
            .setDescription("Купить бонусы"))
    ,
    async execute({ Heroes, interaction, thisUser, thisUserGame, Builder, options, F, CustomEvent, Database, client }) {
        const cmd = options.getSubcommand();
        if (cmd === "use") {
            const heroName = options.getString("hero");
            const attributeName = options.getString("attribute");
            const amount = options.getInteger("amount");
            if (!HeroAttributesEnum[attributeName]) return Builder.createError("Такой тип бонуса не найден!", interaction.user).interactionReply(interaction);
            const hero = Heroes.find(heroName);
            if (!hero) return Builder.createError("Герой не найден!", interaction.user).interactionReply(interaction);
            const mongoHero = thisUserGame.heroes[hero.id];
            if (!mongoHero) return Builder.createError("Герой не имеется!", interaction.user).interactionReply(interaction);
    
            if (!thisUserGame?.levelBonusAttr?.[attributeName] || thisUserGame?.levelBonusAttr?.[attributeName] < 0 || thisUserGame?.levelBonusAttr?.[attributeName] < amount) return Builder.createError("У вас не имеется столько бонусов этого типа.", interaction.user).interactionReply(interaction);
            await Promise.all([
                Database.updateHero(interaction.user.id, hero.id, new HeroAttribute(mongoHero.attr, {[attributeName]: amount})),
                Database.get("Game").updateOne({_id: interaction.user.id}, {$inc: {[`levelBonusAttr.${attributeName}`]: -amount}})
            ]);
    
            Builder.createEmbed().setUser(interaction.user).setSuccess(`Использовано ${HeroAttributesEnum[attributeName]} ${F.formatNumber(amount)} на героя **${hero}**.`).interactionReply(interaction);
        }   else if (cmd === "buy") {
            let attrs = (dis?: boolean) => {
                let b: ButtonBuilder[] = [];
                let texts: string[] = []
                for (let i in HeroAttributesEnum) {
                    const bonusData = BonusBuying[i];
                    texts.push(`${HeroAttributesEnum[i]} ${F.formatNumber(bonusData.amount)} — ${bonusData.cost}`)
                    b.push(
                        Builder.createButton()
                            .setCustomId(`buy$$${i}`)
                            .setEmoji(HeroAttributesEnum[i])
                            .setLabel(`Купить ${F.formatNumber(bonusData.amount)}`)
                            .setDisabled(Boolean(dis))
                            .setStyle("Secondary")
                            .toButtonBuilder()
                    )
                }
                return {
                    buttons: new ActionRowBuilder<any>().addComponents(...b),
                    texts
                };
            }
            let data = attrs()
            const msg = await Builder.createEmbed()
                .setTitle("Покупка бонусов")
                .setText(stripIndents`
                ${HeroAttributesEnum.hp} - Увеличивает ОЗ героя
                ${HeroAttributesEnum.dmg} - Увеличивает атаку героя
                ${HeroAttributesEnum.dxt} - Увеличивает ловкость героя (Если ловкость героя больше, чем у противника, ему отдается первый удар и получает ${DxtDoubleAttackChance}% шанс нанести двойной урон перед каждой атакой.)
                
                ${data.texts.join("\n")}`)
                .setThumbnail(client.user.avatarURL())
                .interactionReply(interaction, {components: [data.buttons], fetchReply: true}) as any as Message;

            const collector = msg.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                time: 30000
            });

            collector.on("end", () => {
                msg.edit({components: [attrs(true).buttons]})
            })

            collector.on("collect", async i => {
                collector.resetTimer()
                await i.deferUpdate();
                const type = i.customId.split("$$")[1];
                const user = await Database.get("User").findOrCreate("_id", i.user.id);
                const game = await Database.get("Game").findOrCreate(i.user);
                const bonus = BonusBuying[type];
                if (bonus.cost.isEnough(user)) {
                    await Promise.all([
                        Database.get("Game").updateOne({_id: i.user.id}, {$set: {levelBonusAttr: new HeroAttribute({[type]: bonus.amount} as any).add(game.levelBonusAttr || {})}}),
                        Database.changeMoney({targetId: i.user.id, type: "user", moneyType: bonus.cost.type, amount: -bonus.cost.amount, CustomEvent})
                    ]);
                    Builder.createEmbed()
                        .setSuccess(`Вы купили ${HeroAttributesEnum[type]} **${bonus.amount}** за **${bonus.cost}**.`)
                        .setUser(i.user)
                        .interactionFollowUp(interaction, {ephemeral: true})
                } else {
                    Builder.createError("У вас недостаточно средств.", i.user).interactionFollowUp(i, {ephemeral: true})
                }

            })
            
        }
    } 
})