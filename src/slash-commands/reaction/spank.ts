import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { ColorObject } from "../../config";
import DIG from "discord-image-generation";
import { AttachmentBuilder } from "discord.js";

export default new SlashCommand({
    id: "spank",
    category: "Reaction",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("spank")
        .setDescription("Шлепать")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель"))
    ,
    async execute ({Builder, interaction, options}) {
        await interaction.deferReply()
        const user = options.getUser("user") || interaction.user;
        const data = await (new DIG.Spank()).getImage(interaction.user.avatarURL({extension: "png"}), user.avatarURL({extension: "png"}));
        const att = new AttachmentBuilder(data, {name: "spank.png"})
        Builder.createEmbed()
            .setColor(ColorObject.none)
            .setImage("attachment://spank.png")
            .editReply(interaction, {files: [att],content: `***${interaction.user.username}* шлёпнул(а) *${user ? (user.id === interaction.user.id ? "себя" : user.username) : "всех"}* 😼**`})
    }
})