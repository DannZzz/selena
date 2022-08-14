import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand({
    id: "deposit",
    category: "Economy",
    data: new SlashBuilder()
        .setName("deposit")
        .setDescription("Передать свои эссенции этому серверу")
        .addIntegerOption(o => o
            .setName("amount")
            .setRequired(true)
            .setDescription("Количество"))
    ,
    cooldown: 3,
    async execute ({Database, client, options, Builder, interaction, thisUser, F, CustomEvent}) {
        const amount = options.getInteger("amount");
        if (amount < 5) return Builder.createEmbed().setError(`Минимальная количество эссенций - ${F.toMoneyString(5, "user", "secondary")}.`).setUser(interaction.user).interactionReply(interaction);
        if (thisUser.secondary < amount) return Builder.createEmbed().setError(`У вас нехватает эссенций ${F.toMoneyString(Math.ceil(amount - thisUser.secondary), "user", "secondary")}.`).setUser(interaction.user).interactionReply(interaction);
        
        await Promise.all([
            Database.changeMoney({targetId: interaction.guildId, amount: F.percentOf(amount, 80), type: "guild", moneyType: "secondary", CustomEvent}),
            Database.changeMoney({targetId: interaction.user.id, amount: -amount, type: "user", moneyType: "secondary", CustomEvent}),
            Database.changeMoney({targetId: interaction.guild.ownerId, amount: F.percentOf(amount, 20), type: "user", moneyType: "secondary", CustomEvent})
        ])

        Builder.createEmbed().setText(`**${interaction.user.username}** благодарим за поддержку.`).interactionReply(interaction, {ephemeral: true})
        Builder.createEmbed().setText(`**${interaction.user.tag}** передал серверу ${F.toMoneyString(amount, "user", "secondary")}.`).sendToChannel(interaction.channel)
    }
})