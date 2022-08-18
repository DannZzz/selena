import { stripIndents } from "common-tags";
import { ActionRowBuilder, EmojiResolvable, Message } from "discord.js";
import { Currency } from "../../structures/Currency";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { HeroAttributesEnum, HeroId, HeroSkinRarityNames } from "../../heroes/heroes-attr";
import { Pagination } from "../../structures/Pagination";
import Database from "../../database/db";
import { Heroes } from "../../heroes/Heroes";
import { CustomEvent } from "../../structures/CustomEvent";
import { Levels } from "../../custom-modules/Level-xp";

export default new SlashCommand({
    id: "hero-info",
    category: "Game",
    data: new SlashBuilder()
        .setName("hero-info")
        .setDescription("Открыть информацию о герое")
        .addStringOption(o => o
            .setName("name")
            .setDescription("Название героя")
            .setRequired(true)
            .setAutocomplete(true)),
    autocomplete: "hero",
    async execute({ interaction, options, Builder, F, thisUser, thisUserGame, CustomEvent, isUserVip }) {
        const heroName = options.getString("name");
        const hero = Heroes.find(heroName);
        if (!hero) return Builder.createEmbed().setUser(interaction.user).setError("Герой не найден!").interactionReply(interaction);
        const dis = (hero.isVip ? isUserVip : true) && hero.isAvailableInShop && thisUser[hero.cost.type] >= hero.cost.amount && !thisUserGame.heroes[hero.id] ? false : true;
        let label: string = "Купить";
        let emoji: EmojiResolvable = Currency.types.user[hero.cost.type] + "";
        if (thisUserGame.heroes[hero.id]) {
            label = "Уже имеется"
        } else if (!hero.isAvailableInShop) {
            label = 'Не доступен'
        } else if (hero.isVip && !isUserVip) {
            label = "Нужен VIP статус"
        } else if (thisUser[hero.cost.type] < hero.cost.amount) {
            label = "Не достаточно"
        }

        const mongoHero = thisUserGame.heroes[hero.id];
        
        const buttonsRow = (jst?: boolean) => [
            Builder.createButton()
                .setCustomId("buy-this-hero")
                .setLabel(label)
                .setDisabled(jst || dis)
                .setStyle(dis ? "Danger" : "Success")
                .setEmoji(emoji)
                .toButtonBuilder(),
            Builder.createButton()
                .setCustomId("open-skins")
                .setLabel("Облики")
                .setDisabled(jst || false)
                .setStyle("Primary")
                .toButtonBuilder()
        ];

        function buyButtonRow(jst?: boolean) {
            return new ActionRowBuilder().addComponents(buttonsRow(jst)) as any;
        }
        let builder;
        let att = hero.avatarAttachment();
        if (mongoHero) {
            const skin = Heroes.findSkin(hero.id, mongoHero.skin);
            const _games = mongoHero.games || 0;
            const _wins = mongoHero.wins || 0;
            att = hero.avatarAttachment(skin.id);
            builder = Builder.createEmbed()
                .setThumbnail(`attachment://${att.name}`)
                .setAuthor(`Герой: ${hero.elements} ${hero}`)
                .setTitle(`${HeroSkinRarityNames[skin.rarity]} Облик: ${skin.name}`)
                .setText(hero.description)
                .setColor(Heroes.getSkinColor(skin))
                .addField("Коллекции", Heroes.collections.heroCollections(hero.id)?.map(c => c.emoji)?.join(" ") || "Не находится в коллекций")
                .addField("Уровень", `${F.levelFormat(mongoHero.xp || 0)}`)
                .addField("Активность", `Всего игр: ${F.formatNumber(_games)}\nВсего побед: ${F.formatNumber(_wins)} (${F.wr(_games, _wins)})`)
                .addField("Характеристики", `${Heroes.attr(hero.id, mongoHero)}`)
                .addField("Цена", `${hero.cost}`)
        } else {
            builder = Builder.createEmbed()
                .setThumbnail(`attachment://${att.name}`)
                .setAuthor(`Герой: ${hero.elements} ${hero}`)
                .setText(hero.description)
                .addField("Коллекции", Heroes.collections.heroCollections(hero.id)?.map(c => c.emoji)?.join(" ") || "Не находится в коллекций")
                .setColor(Heroes.getSkinColor(Heroes.findSkin(hero.id, hero.id)))
                .addField("Характеристики", `${hero.attr}`)
                .addField("Цена", `${hero.cost}`)
        }
        
        const msg = await builder
            .interactionReply(interaction, { files: [att], fetchReply: true, components: [buyButtonRow()] }) as any as Message;

        const coll = msg.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, time: 30000 });

        coll.on("end", () => {
            msg.edit({ components: [buyButtonRow(true)] });
        })

        coll.on("collect", async (i): Promise<any> => {
            coll.resetTimer();
            const _thisUser = await Database.get("User").findOrCreate(interaction.user);
            const _thisUserGame = await Database.get("Game").findOrCreate("_id", interaction.user.id)
            if (i.customId === "open-skins") {

                function lb(heroId: string, skin: string) {
                    const haveHero = _thisUserGame.heroes[heroId]
                    let label: string;
                    let buyDis = false;
                    if (!haveHero) {
                        label = "Сначала купите этого героя";
                        buyDis = true
                    } else if (skin === haveHero.skin) {
                        label = "Облик используется"
                        buyDis = true
                    } else if (!haveHero.skinsHave.includes(skin)) {
                        if (Heroes.findSkin(heroId, skin).availableUntil && !F.isLimited(Heroes.findSkin(heroId, skin).availableUntil)) {
                            buyDis = true
                            label = "Недоступно"
                        } else if (Heroes.findSkin(heroId, skin).cost.type) {
                            label = "Купить"
                        } else {
                            label = `${Heroes.findSkin(heroId, skin).cost}`
                            buyDis = true
                        }
                    } else {
                        label = "Применить"
                    }

                    return { label, isDisabled: buyDis };
                }

                const embeds = [];
                const attachments = [];
                const otherButtons: Pagination["otherButtons"] = [];
                // basic skin
                const herolb = lb(hero.id, hero.id);
                const batt = hero.avatarAttachment();
                attachments.push(batt);
                embeds.push(
                    Builder.createEmbed()
                        .setImage(`attachment://${batt.name}`)
                        .setAuthor(`Герой: ${hero}`)
                        .setTitle(`${HeroSkinRarityNames.common} Облик: ${hero}`)
                        .setColor(Heroes.getSkinColor(Heroes.findSkin(hero.id, hero.id)))
                        .addField("Цена", `Бесплатно`)
                        .toEmbedBuilder()
                )
                otherButtons.push({
                    button: Builder.createButton()
                        .setCustomId(`skinChange$${hero.id}$${hero.id}`)
                        .setLabel(herolb.label)
                        .setDisabled(herolb.isDisabled)
                        .setStyle("Primary")
                        .toButtonBuilder(),
                    onclick: async (i) => {
                        const resp = await setOrBuySkin(i.user.id, hero.id, hero.id);
                        Builder.createEmbed().setText(resp).setUser(i.user).interactionFollowUp(i);
                    }
                })
                // other skins
                for (let skin of hero.skins) {
                    const skinAtt = hero.avatarAttachment(skin.id);
                    attachments.push(skinAtt);
                    const _slb = lb(hero.id, skin.id);
                    otherButtons.push({
                        button: Builder.createButton()
                            .setCustomId(`skinChange$${hero.id}$${skin.id}`)
                            .setLabel(_slb.label)
                            .setDisabled(_slb.isDisabled)
                            .setStyle("Primary")
                            .toButtonBuilder(),
                        onclick: async (i) => {
                            const resp = await setOrBuySkin(i.user.id, hero.id, skin.id);
                            Builder.createEmbed().setText(resp).setUser(i.user).interactionFollowUp(i);
                        }
                    });
                    const b =  Builder.createEmbed()
                        .setImage(`attachment://${skinAtt.name}`)
                        .setAuthor(`Герой: ${hero}`)
                        .setTitle(`${HeroSkinRarityNames[skin.rarity]} Облик: ${skin.name}`)
                        .setColor(Heroes.getSkinColor(skin))
                        .addField("Бонус", `${Object.entries(skin.bonus).map(([key, number]) => `+ ${HeroAttributesEnum[key]} ${F.formatNumber(number)}`).join("\n")}`)
                        .addField("Цена", `${skin.cost}`);

                    if (skin.availableUntil) b.addField("Временный облик", `${F.isLimited(skin.availableUntil) ? `Закончится ${F.moment(skin.availableUntil).fromNow()}` : "Закончено"}`)
                    
                    embeds.push(
                       b.toEmbedBuilder()
                    )
                }

                new Pagination({ otherButtons, embeds, attachments, interaction: i, validIds: [i.user.id] }).createSimplePagination();
                return;
            }
            await i.deferReply();

            const allow = hero.isAvailableInShop && _thisUser[hero.cost.type] >= hero.cost.amount && !_thisUserGame.heroes[hero.id] ? true : false;

            if (!allow) return Builder.createEmbed().setError("Вы не сможете купить этого героя!").setUser(i.user).editReply(i);
            await Promise.all([
                Database.changeMoney({ targetId: i.user.id, amount: -hero.cost.amount, moneyType: hero.cost.type, type: "user", CustomEvent }),
                Database.updateHero(interaction.user.id, hero.id, { type: "add" })
            ])

            Builder.createEmbed().setText(`Вы успешно купили героя **${heroName}**.`).setUser(i.user).editReply(i);
        })

    }
})

async function setOrBuySkin(userId: string, heroId: HeroId, skin: string, ce?: CustomEvent): Promise<string> {
    const userData = await Database.get("User").findOrCreate("_id", userId);
    const gameData = await Database.get("Game").findOrCreate("_id", userId);
    const haveHero = gameData.heroes[heroId];
    const skinData = Heroes.findSkin(heroId, skin);
    if (!haveHero) {
        return "Сначала купите этого героя.";
    } else if (skin === haveHero.skin) {
        return "Облик используется."
    } else if (!haveHero.skinsHave.includes(skin)) {
        if (Heroes.findSkin(heroId, skin).cost.type) {
            if (userData[skinData.cost.type] < skinData.cost.amount) return "У вас недостаточно средств."
            await Promise.all([
                Database.updateHero(userId, heroId, {type: "set-skin", skin: skinData.id}),
                Database.changeMoney({targetId: userId, type: "user", moneyType: skinData.cost.type, amount: -skinData.cost.amount, CustomEvent: ce})
            ])
            return `Успешно куплен **${HeroSkinRarityNames[skinData.rarity]}** облик: **${skinData.name}**.`
        } else {
            return `${Heroes.findSkin(heroId, skin).cost}`
        }
    } else {
        await Database.updateHero(userId, heroId, {type: "set-skin", skin: skinData.id})
        return `Теперь используется облик: **${skinData.name}**.`
    }
}