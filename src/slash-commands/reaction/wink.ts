import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { ColorObject } from "../../config";
import { AnimeGif } from "../../structures/Anime-gif";

export default new SlashCommand({
    id: "wink",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("wink")
        .setDescription("Подмигнуть глазом")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель"))
    ,
    async execute ({Builder, interaction, options}) {
        await interaction.deferReply();

        const user = options.getUser("user");
        const image = await AnimeGif.getLink("wink");
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image)
            .editReply(interaction, {content: `***${interaction.user.username}* подмигнул(а) *${user ? (user.id === interaction.user.id ? "себе :thinking:" : user.username) : "всем"}* 👀**`})
    }
})