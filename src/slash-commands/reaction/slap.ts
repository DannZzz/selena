import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import ainasepics from "ainasepics"
import { ColorObject } from "../../config";

export default new SlashCommand({
    id: "slap",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("slap")
        .setDescription("Дать пощёчину")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель"))
    ,
    async execute ({Builder, interaction, options}) {
        const user = options.getUser("user");
        const image = await ainasepics.get("slap");
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image.url)
            .interactionReply(interaction, {content: `***${interaction.user.username}* дал(а) пощёчину *${user ? (user.id === interaction.user.id ? "себе" : user.username) : "всем"}* 👀**`})
    }
})