import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import ainasepics from "ainasepics"
import { ColorObject } from "../../config";

export default new SlashCommand({
    id: "nom",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("nom")
        .setDescription("Поесть")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель"))
    ,
    async execute ({Builder, interaction, options}) {
        const user = options.getUser("user");
        const image = await ainasepics.get("nom");
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image.url)
            .interactionReply(interaction, {content: `***${interaction.user.username}* ${user ? (user.id === interaction.user.id ? "поел(а)" : `дал(а) поесть *${user.username}*`) : "кормит всех"} 🍨**`})
    }
})