import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import ainasepics from "ainasepics"
import { ColorObject } from "../../config";

export default new SlashCommand({
    id: "panic",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("panic")
        .setDescription("Паниковать")
    ,
    async execute ({Builder, interaction, options}) {
        const user = options.getUser("user");
        const image = await ainasepics.get("panic");
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image.url)
            .interactionReply(interaction, {content: `***${interaction.user.username}* паникуеетт 😬**`})
    }
})