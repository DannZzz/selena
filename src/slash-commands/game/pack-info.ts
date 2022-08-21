import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { Pagination } from "../../structures/Pagination";
import { stripIndents } from "common-tags";
import { HeroElementsContrs, HeroElementsNames } from "../../heroes/heroes-attr";
import { Pack, Packs } from "../../heroes/Packs";
import { HeroCostIfExists } from "../../docs/CommandSettings";
import { Currency } from "../../structures/Currency";
import { ObjectType } from "../../structures/MainTypes";

export default new SlashCommand({
    id: "pack-info",
    category: "Game",
    autocomplete: "all-packs",
    data: new SlashBuilder()
        .setName("pack-info")
        .setDescription("Описание Пака")
        .addStringOption(o => o
            .setName("pack")
            .setDescription("Название пака")
            .setRequired(true)
            .setAutocomplete(true)),
    async execute({ Heroes, interaction, thisUser, thisUserGame, Builder, options, F, CustomEvent, Database }) {
        const name = options.getString("pack");

        const pack = Packs.find(name) as Pack<any>;
        if (!pack) return Builder.createError("Пак не найден.", interaction.user).interactionReply(interaction);
        let rwString: string = "";

        if (pack.type === "hero") {
            const p = pack as Pack<'hero'>;
            const rwHero = F.resolveHero(p.reward())[0];
            rwString = `получите героя ${rwHero.emoji} **${rwHero}**.`
        } else if (pack.type === "money") {
            const p = pack as Pack<'money'>;;
            rwString = `получите ${F.andOr(Currency.list("user").map(x => `${x}`))} в рандомном количестве.`
        } else if (pack.type === "hero-pick") {
            const p = pack as Pack<'hero-pick'>;;
            rwString = `выберите один из этих героев: ${F.andOr(p.reward().heroes.map(x => `${x.emoji} **${x}**`), true)}.`
        } else if (pack.type === "skin-pick") {
            const p = pack as Pack<"skin-pick">;
            rwString = `выберите один из этих обликов: ${F.andOr(p.reward().map(hd => `**${F.resolveHero(hd.hero)[0].skins.find(s => s.id === hd.skinId)?.name || "Неизвестный"}** (${F.resolveHero(hd.hero)[0]})`), true)}`
        }
        
        Builder.createEmbed()
            .setThumbnail(F.resolveEmojiToLink(pack.emoji as any).link)
            .setTitle(pack.name)
            .setText(`Откройте этот пак и ${rwString}`)
            .interactionReply(interaction)

    }
})