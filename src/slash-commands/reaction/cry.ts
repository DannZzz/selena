import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import ainasepics from "ainasepics"
import { ColorObject } from "../../config";

export default new SlashCommand({
    id: "cry",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("cry")
        .setDescription("Заплакать")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель"))
    ,
    async execute ({Builder, interaction, options}) {
        const user = options.getUser("user");
        const image = await ainasepics.get("cry");
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image.url)
            .interactionReply(interaction, {content: `***${interaction.user.username}* заплакал(а) ${user ? (user.id === interaction.user.id ? "из-за себя" : `из-за *${user.username}*`) : "..."} 😰**`})
    }
})