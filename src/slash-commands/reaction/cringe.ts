import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import ainasepics from "ainasepics"
import { ColorObject } from "../../config";

export default new SlashCommand({
    id: "cringe",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("cringe")
        .setDescription("Какой кринж")
    ,
    async execute ({Builder, interaction, options}) {
        const user = options.getUser("user");
        const image = await ainasepics.get("cringe");
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image.url)
            .interactionReply(interaction, {content: `**😱 Какооой кринжж 😱**`})
    }
})