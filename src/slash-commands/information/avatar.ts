import { EmbedBuilder } from "@discordjs/builders";
import { Pagination } from "../../structures/Pagination";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "avatar",
    category: "Information",
    data: new SlashBuilder()
        .setName("avatar")
        .setDescription("Открыть аватарку и баннер участника")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель"))
    ,
    async execute ({interaction, Builder, options}) {
        let user = options.getUser("user") || interaction.user;
        try {
            user = await user.fetch();
        } catch {}
        let embeds = []
        embeds.push(Builder.createEmbed().clear().setColor().setTitle(`Аватар: ${user.tag}`).setImage(user.avatarURL({size: 2048})).toEmbedBuilder())
        if (user.banner) embeds.push(Builder.createEmbed().clear().setColor().setTitle(`Баннер: ${user.tag}`).setImage(user.bannerURL({size: 4096})).toEmbedBuilder())

        new Pagination({embeds, validIds: [interaction.user.id], interaction}).createSimplePagination();
    }
})