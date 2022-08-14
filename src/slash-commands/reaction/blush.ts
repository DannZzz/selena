import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import ainasepics from "ainasepics"
import { ColorObject } from "../../config";

export default new SlashCommand({
    id: "blush",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("blush")
        .setDescription("Окраснеть")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель"))
    ,
    async execute ({Builder, interaction, options}) {
        const user = options.getUser("user");
        const image = await ainasepics.get("blush");
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image.url)
            .interactionReply(interaction, {content: `***${interaction.user.username}* окраснел(а) из-за *${user ? (user.id === interaction.user.id ? "себя" : user.username) : "всех"}* 👺**`})
    }
})