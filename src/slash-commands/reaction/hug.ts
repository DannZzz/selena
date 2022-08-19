import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { ColorObject } from "../../config";
import { AnimeGif } from "../../structures/Anime-gif";

export default new SlashCommand({
    id: "hug",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("hug")
        .setDescription("Обнять")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель"))
    ,
    async execute ({Builder, interaction, options}) {
        await interaction.deferReply();

        const user = options.getUser("user");
        const image = await AnimeGif.getLink("hug");
        console.log(image)
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image)
            .editReply(interaction, {content: `***${interaction.user.username}* обнял(а) *${user ? (user.id === interaction.user.id ? "себя" : user.username) : "всех"}* 💞**`})
    }
})