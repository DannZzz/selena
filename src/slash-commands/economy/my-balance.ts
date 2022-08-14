import { stripIndents } from "common-tags";
import { HeroAttributesEnum } from "../../heroes/heroes-attr";
import { Packs } from "../../heroes/Packs";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand({
    id: "my-balance",
    category: "Economy",
    data: new SlashBuilder()
        .setName("my-balance")
        .setDescription("Посмотреть свой баланс")
    ,
    async execute ({thisUser, Builder, interaction, F, thisUserGame, Heroes}) {
        const bonuses = {} as any;
        for (let i in HeroAttributesEnum) {
            bonuses[i] = thisUserGame?.levelBonusAttr?.[i] || 0;
        }
        Builder.createEmbed()
            .setUser(interaction.user, "author")
            .setText(stripIndents`
            **Всего эссенций:** ${F.toMoneyString(thisUser.secondary, "user", "secondary")}
            **Всего кристаллов:** ${F.toMoneyString(thisUser.primary, "user", "primary")}

            **Бонусы ( /bonus use )**
            **${Heroes.attrFrom(bonuses).stringed.join(" | ")}**

            ${Object.entries(Packs.resolveUserPacks(thisUser.packs)).map(([key, [amount, pack]]) => `**${pack.name}:** ${pack.emoji} ${F.formatNumber(amount)}`).join("\n0")}
            `)
            .interactionReply(interaction, {ephemeral: true});
    }
})