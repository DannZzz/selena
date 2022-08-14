import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "change-money",
    category: "Economy",
    isDevOnly: true,
    data: new SlashBuilder("Administrator")
        .setName("change-money")
        .setDescription("Change money")
        .addStringOption(o => o
            .setName("target")
            .setDescription("target id")
            .setRequired(true))
        .addStringOption(o => o
            .setName("type")
            .setDescription("data type")
            .addChoices(...toChoices([["guild", "guild"], ["user", "user"]]))
            .setRequired(true))
        .addStringOption(o => o
            .setName("money-type")
            .setDescription("money type")
            .addChoices(...toChoices([["secondary", "secondary"], ["primary", "primary"]]))
            .setRequired(true))
        .addIntegerOption(o => o
            .setName("amount")
            .setDescription("amount of money")
            .setRequired(true)),
    permissions: "Administrator",
    async execute({interaction, Database, F, options, Builder, CustomEvent}) {
        const id = options.getString("target");
        const dataType = options.getString("type");
        const moneyType = options.getString("money-type");
        const amount = options.getInteger("amount");

        await Database.changeMoney({targetId: id, type: dataType as any, moneyType: moneyType as any, amount, CustomEvent});
        Builder.createEmbed().setSuccess("Сделано").interactionReply(interaction, {ephemeral: true});
    }
})