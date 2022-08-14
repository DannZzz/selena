import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { Pagination } from "../../structures/Pagination";
import { stripIndents } from "common-tags";
import { HeroElementsContrs, HeroElementsNames } from "../../heroes/heroes-attr";
import { Pack, Packs } from "../../heroes/Packs";
import { HeroCostIfExists } from "../../docs/CommandSettings";
import { Currency } from "../../structures/Currency";
import { ObjectType } from "../../structures/MainTypes";

export default new SlashCommand({
    id: "open-pack",
    category: "Game",
    autocomplete: "my-packs",
    data: new SlashBuilder()
        .setName("open-pack")
        .setDescription("Открыть паки")
        .addStringOption(o => o
            .setName("pack")
            .setDescription("Название пака")
            .setRequired(true)
            .setAutocomplete(true)),
    async execute({ Heroes, interaction, thisUser, thisUserGame, Builder, options, F, CustomEvent, Database }) {
        const name = options.getString("pack");

        const pack = Packs.find(name) as Pack<any>;
        if (!pack) return Builder.createError("Пак не найден.", interaction.user).interactionReply(interaction);
        const packData = Packs.resolveUserPacks(thisUser.packs)[pack.id];
        if (!packData) return Builder.createError("Вы не имеете этот пак!", interaction.user).interactionReply(interaction);

        if (pack.type === "hero") {
            const p = pack as Pack<"hero">;
            const rewardHero = F.resolveHero(p.reward())?.[0]
            if (!rewardHero) return Builder.createError("Вышла ошибка, герой не найден!", interaction.user).interactionReply(interaction);
            if (thisUserGame.heroes[rewardHero.id]) {
                await Database.changeMoney({ targetId: interaction.user.id, amount: HeroCostIfExists, type: "user", moneyType: "primary", CustomEvent });
                Builder.createEmbed().setUser(interaction.user).setText(`Вы получаете героя ${F.toMoneyString(HeroCostIfExists, "user", "primary")}, вместо героя **${rewardHero}**.`).interactionReply(interaction);
            } else {
                await Database.updateHero(interaction.user.id, rewardHero.id, { type: "add" });
                const att = rewardHero.avatarAttachment();
                Builder.createEmbed().setUser(interaction.user).setText(`Вы получаете героя: **${rewardHero}**.`).setImage(`attachment://${att.name}`).interactionReply(interaction, { files: [att] })
            }
            await Database.updatePack(interaction.user.id, pack.id, -1)
        } else if (pack.type === "hero-pick") {
            const p = pack as Pack<"hero-pick">;
            const embeds = [];
            const attachments = [];
            const otherButtons: Pagination["otherButtons"] = [];
            p.reward().heroes.forEach(hero => {
                const att = hero.avatarAttachment();
                attachments.push(att);
                otherButtons.push({
                    button: Builder.createButton()
                        .setCustomId(`pack-reward$${hero.id}`)
                        .setLabel("Выбрать этого героя")
                        .setStyle("Primary")
                        .toButtonBuilder(),
                    onclick: async (i) => {
                        const user = await Database.get("User").findOrCreate("_id", interaction.user.id);
                        const _packData = Packs.resolveUserPacks(user.packs)[pack.id];
                        if (!_packData) return Builder.createError("Вы не имеете этот пак!", i.user).interactionFollowUp(i);
                        const game = await Database.get("Game").findOrCreate(interaction.user);
                        if (game.heroes[hero.id]) return Builder.createEmbed().setError('Вы уже имеете этого героя.').setUser(i.user).interactionFollowUp(i);
                        const att = hero.avatarAttachment()
                        await Promise.all([
                            Database.updatePack(interaction.user.id, pack.id, -1),
                            Database.updateHero(interaction.user.id, hero.id, { type: "add" }),
                        ])
                        Builder.createEmbed().setUser(interaction.user).setText(`Вы получаете героя: **${hero}**.`).setImage(`attachment://${att.name}`).interactionFollowUp(i, { files: [att] })
                    }
                });
                embeds.push(
                    Builder.createEmbed()
                        .setImage(`attachment://${att.name}`)
                        .setAuthor(`Выберите бесплатного героя`)
                        .setTitle(`Герой: ${hero.elements} ${hero}`)
                        .setText(hero.description)
                        .setColor(Heroes.getSkinColor(Heroes.findSkin(hero.id, hero.id)))
                        .addField("Характеристики", `${hero.attr}`)
                        .toEmbedBuilder()
                )
            });
            new Pagination({interaction, embeds, attachments, otherButtons, validIds: [interaction.id]}).createSimplePagination();
        } else if (pack.type === "money") {

            const p = pack as Pack<"money">;
            const money = Currency.from(...p.reward());
            
            await Promise.all([
                Database.updatePack(interaction.user.id, pack.id, -1),
                money.updateBase(interaction.user.id, CustomEvent)
            ])

            Builder.createEmbed().setText(`Вы получаете: ${money}.`).setUser(interaction.user).interactionReply(interaction);
        }


    }
})