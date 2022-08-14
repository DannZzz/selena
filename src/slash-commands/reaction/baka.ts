import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import ainasepics from "ainasepics"
import { ColorObject } from "../../config";

export default new SlashCommand({
    id: "baka",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("baka")
        .setDescription("baka baka baka")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель"))
    ,
    async execute ({Builder, interaction, options}) {
        const user = options.getUser("user");
        const image = await ainasepics.get("baka");
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image.url)
            .interactionReply(interaction, {content: `**Эй, *${user ? `ты ${user.username}` : "вы все"}* бакааа 😡**`})
    }
})