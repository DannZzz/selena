import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { ColorObject } from "../../config";
import { AnimeGif } from "../../structures/Anime-gif";

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
        await interaction.deferReply();

        const user = options.getUser("user");
        const image = await AnimeGif.getLink("slap");
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image)
            .editReply(interaction, {content: `***${interaction.user.username}* дал(а) пощёчину *${user ? (user.id === interaction.user.id ? "себе" : user.username) : "всем"}* 👀**`})
    }
})