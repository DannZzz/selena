import { GuildMember } from "discord.js";
import { RoleShopSlots } from "../../docs/CommandSettings";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "remove-role",
    category: "Economy",
    data: new SlashBuilder("ManageGuild")
        .setName("remove-role")
        .setDescription("убрать роль")
        .addIntegerOption(o => o
            .setName("index")
            .setDescription("Номер # роли")
            .setRequired(true)),
    cooldown: 3,
    permissions: "ManageGuild",
    async execute ({Database, interaction, options, F, Builder, thisUser, thisGuild, isGuildPremium, CustomEvent}) {
        const index = options.getInteger("index") - 1;

        const maxLimit = isGuildPremium ? RoleShopSlots.premium : RoleShopSlots.basic;
        const shop = (thisGuild.roleShop || []).slice(0, maxLimit);
        const item = shop[index];
        if (!item) return Builder.createEmbed().setError("Предмет не найден!").setUser(interaction.user).interactionReply(interaction);

        const items = shop.filter(it => it.roleId !== item.roleId);
        
        await Database.get("Guild").updateOne({_id: interaction.guildId}, {$set: {roleShop: items}});

        Builder.createEmbed().setUser(interaction.user).setSuccess(`Предмет убран.`).interactionReply(interaction);
    }
})