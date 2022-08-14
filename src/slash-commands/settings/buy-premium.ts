import { stripIndents } from "common-tags";
import ms from "ms";
import { WebName } from "../../config";
import { PremiumServerDuration } from "../../docs/CommandSettings";
import { PremiumServerDurationOptions } from "../../docs/SlashOptions";
import { Currency } from "../../structures/Currency";
import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "premium-server",
    onlyGuildOwner: true,
    category: "Settings",
    data: new SlashBuilder("Administrator")
        .setName("premium-server")
        .setDescription("Премиум статус сервера")
        .addSubcommand(s => s
            .setName("status")
            .setDescription("Посмотреть тарифы"))
        .addSubcommand(s => s
            .setName("buy")
            .setDescription("Купить/Продлить Премиум статус сервера")
            .addStringOption(o => o
                .setName("duration")
                .setDescription("Длительность тарифа")
                .setRequired(true)
                .addChoices(...toChoices(PremiumServerDurationOptions))))
    ,
    permissions: "Administrator",
    async execute ({interaction, Builder, options, isGuildPremium, Database, thisGuild, client, F}) {
        const cmd = options.getSubcommand();
        if (cmd === "status") {
            Builder.createEmbed()
                .setThumbnail(client.user.avatarURL())
                .setTitle("Доступные тарифы")
                .setText(PremiumServerDuration.map(o => `На ${o.visual} — ${Currency.types.guild[o.cost.type]} ${F.formatNumber(o.cost.amount)}`).join("\n"))
                .interactionReply(interaction)
        } else if (cmd === "buy") {
            const duration = options.getString("duration");
            const d = PremiumServerDuration.find(o => o.duration === duration);

            if (thisGuild[d.cost.type] < d.cost.amount) return Builder.createError(`У вас недостаточно эссенций.`, interaction.user).interactionReply(interaction);

            await Database.changeMoney({targetId: interaction.guildId, type: "guild", moneyType: d.cost.type, amount: -d.cost.amount})

            if (isGuildPremium) {
                const now = thisGuild.premiumUntil;
                await Database.get("Guild").updateOne({_id: interaction.guildId}, {$set: {premiumUntil: new Date(now.getTime() + ms(duration))}});
                Builder.createEmbed().setSuccess(`Вы успешно продлили **Премиум** статус до **${F.moment(new Date(now.getTime() + ms(duration))).format("LL")}**.`).setUser(interaction.user).interactionReply(interaction);
            } else {
                await Database.get("Guild").updateOne({_id: interaction.guildId}, {$set: {premiumUntil: new Date(Date.now() + ms(duration))}});
                Builder.createEmbed().setSuccess(`Вы успешно купили **Премиум** статус на **${d.visual}**.`).setUser(interaction.user).interactionReply(interaction);
            }
        }
    }
})