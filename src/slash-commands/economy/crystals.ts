import { stripIndents } from "common-tags";
import { PrimaryMoneyBuy, PrimaryToSecondary } from "../../docs/CommandSettings";
import { Currency } from "../../structures/Currency";
import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "crystals",
    category: "Economy",
    data: new SlashBuilder ()
        .setName("crystals")
        .setDescription("Действия с кристаллами")
        .addSubcommand(s => s
            .setName("info")
            .setDescription("Ценность кристаллов"))
        .addSubcommand(s => s
            .setName("convert")
            .setDescription("Конвертировать кристаллы на эссенций")
            .addStringOption(o => o
                .setRequired(true)
                .setName("amount")
                .setDescription("Количество кристаллов")
                .setChoices(...toChoices(PrimaryToSecondary.map(s => [`${s.primary}`, `${s.primary}`])))))
    ,
    async execute ({interaction, CustomEvent, Database, F, Builder, client, options, thisUser }) {
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
                .setText(stripIndents`
                ${PrimaryMoneyBuy.map((o, i) => `**#${i+1}** ${Currency.types.user.primary} ${F.formatNumber(o.primaryAmount)} — ${F.formatNumber(o.inRub)} RUB`).join("\n")}
                
                **Цены за Конвертирование**
                ${PrimaryToSecondary.map(o => `${Currency.types.user.primary} ${F.formatNumber(o.primary)} --> ${Currency.types.user.secondary} ${F.formatNumber(o.secondary)}`).join("\n")}
                `)
                .setThumbnail(client.user.avatarURL())
                .interactionReply(interaction, {components: [button]});
        } else if (cmd === "convert") {
            const amount = +options.getString("amount");

            const d = PrimaryToSecondary.find(o => o.primary === amount);
            if (!d) return Builder.createError("Недопустимое количество кристаллов!", interaction.user).interactionReply(interaction);

            if (thisUser.primary < d.primary) return Builder.createError("Недостаточно кристаллов!", interaction.user).interactionReply(interaction);

            await Promise.all([
                Database.changeMoney({targetId: interaction.user.id, type: "user", moneyType: "primary", amount: -d.primary, CustomEvent}),
                Database.changeMoney({targetId: interaction.user.id, type: "user", moneyType: "secondary", amount: d.secondary, CustomEvent})
            ]);

            Builder.createEmbed()
                .setTitle("🔄 | Конвертация")
                .setText(`Сделано: ${Currency.types.user.primary} ${F.formatNumber(d.primary)} --> ${Currency.types.user.secondary} ${F.formatNumber(d.secondary)}`)
                .interactionReply(interaction)
        }
    }
})