import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "change-xp",
    category: "Economy",
    isDevOnly: true,
    data: new SlashBuilder("Administrator")
        .setName("change-xp")
        .setDescription("Change money")
        .addUserOption(o => o
            .setName("target")
            .setDescription("target")
            .setRequired(true))
        .addIntegerOption(o => o
            .setName("amount")
            .setDescription("amount of xp")
            .setRequired(true)),
    permissions: "Administrator",
    async execute({interaction, Database, F, options, Builder, CustomEvent}) {
        const user = options.getUser("target");
        const amount = options.getInteger("amount");

        await Database.addUserXp(user.id, amount, CustomEvent, interaction.channel);
        Builder.createEmbed().setSuccess("Сделано").interactionReply(interaction, {ephemeral: true});
    }
})