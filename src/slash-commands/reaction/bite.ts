import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import ainasepics from "ainasepics"
import { ColorObject } from "../../config";

export default new SlashCommand({
    id: "bite",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("bite")
        .setDescription("Укусить")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель"))
    ,
    async execute ({Builder, interaction, options}) {
        const user = options.getUser("user");
        const image = await ainasepics.get("bite");
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image.url)
            .interactionReply(interaction, {content: `***${interaction.user.username}* укусил(а) *${user ? (user.id === interaction.user.id ? "себя" : user.username) : "всех"}* 😼**`})
    }
})