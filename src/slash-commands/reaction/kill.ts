import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { ColorObject } from "../../config";
import { AttachmentBuilder } from "discord.js";
import { AnimeGif } from "../../structures/Anime-gif";

export default new SlashCommand({
    id: "kill",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("kill")
        .setDescription("Убить")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель"))
    ,
    async execute ({Builder, interaction, options}) {
        await interaction.deferReply()
        const user = options.getUser("user") || interaction.user;
        const image = await AnimeGif.getLink('kill')
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage(image)
            .editReply(interaction, {content: `***${interaction.user.username}* убил(а) *${user ? (user.id === interaction.user.id ? "себя" : user.username) : "всех"}* 😨**`})
    }
})