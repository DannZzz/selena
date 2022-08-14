import { stripIndents } from "common-tags";
import { PrimaryMoneyBuy } from "../../docs/CommandSettings";
import { Currency } from "../../structures/Currency";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "crystals",
    category: "Economy",
    data: new SlashBuilder ()
        .setName("crystals")
        .setDescription("Действия с кристаллами")
        .addSubcommand(s => s
            .setName("info")
            .setDescription("Ценность кристаллов"))
    ,
    async execute ({interaction, CustomEvent, Database, F, Builder, client, options, }) {
        const cmd = options.getSubcommand();
        if (cmd === "info") {
            const button = Builder.createButton()
                .setCustomId("crystal-buying-info")
                .setEmoji("❔")
                .setLabel("Как купить")
                .setStyle("Primary")
                .toActionRow();

            Builder.createEmbed()
                .setTitle("Кристаллы")
                .setText(stripIndents`${PrimaryMoneyBuy.map((o, i) => `**#${i+1}** ${Currency.types.user.primary} ${F.formatNumber(o.primaryAmount)} — ${F.formatNumber(o.inRub)} RUB`).join("\n")}`)
                .setThumbnail(client.user.avatarURL())
                .interactionReply(interaction, {components: [button]});
        }
    }
})