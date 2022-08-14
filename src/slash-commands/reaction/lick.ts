import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import ainasepics from "ainasepics"
import { ColorObject } from "../../config";

export default new SlashCommand({
    id: "lick",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("lick")
        .setDescription("Лизать")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель"))
    ,
    async execute ({Builder, interaction, options}) {
        const user = options.getUser("user");
        const image = await ainasepics.get("lick");
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image.url)
            .interactionReply(interaction, {content: `***${interaction.user.username}* лизнул(а) *${user ? (user.id === interaction.user.id ? "себя" : user.username) : "всех"}* 😛**`})
    }
})