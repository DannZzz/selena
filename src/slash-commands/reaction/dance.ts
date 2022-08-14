import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import ainasepics from "ainasepics"
import { ColorObject } from "../../config";

export default new SlashCommand({
    id: "dance",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("dance")
        .setDescription("Танцевать")
    ,
    async execute ({Builder, interaction, options}) {
        const user = options.getUser("user");
        const image = await ainasepics.get("dance");
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image.url)
            .interactionReply(interaction, {content: `***${interaction.user.username}* танцует не отдыхая 👯‍♂️**`})
    }
})