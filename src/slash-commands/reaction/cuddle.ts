import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { ColorObject } from "../../config";
import { AnimeGif } from "../../structures/Anime-gif";

export default new SlashCommand({
    id: "cuddle",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("cuddle")
        .setDescription("Прижмать")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель"))
    ,
    async execute ({Builder, interaction, options}) {
        await interaction.deferReply();

        const user = options.getUser("user");
        const image = await AnimeGif.getLink("cuddle");
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image)
            .editReply(interaction, {content: `***${interaction.user.username}* прижмал(а) к себе *${user ? (user.id === interaction.user.id ? "себя :thinking:" : user.username) : "всех"}* 💞**`})
    }
})