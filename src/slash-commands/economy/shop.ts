import { RoleShopSlots } from "../../docs/CommandSettings";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "shop",
    category: "Economy",
    data: new SlashBuilder()
        .setName("shop")
        .setDescription("Магазин ролей сервера")
    ,
    async execute({interaction, thisGuild, F, isGuildPremium, Builder, client}) {
        const maxLimit = isGuildPremium ? RoleShopSlots.premium : RoleShopSlots.basic;
        const shop = (thisGuild.roleShop || []).slice(0, maxLimit);

        const builder = Builder.createEmbed().setUser(client.user).setTitle(`🏦 Магазин - ${interaction.guild.name}`).setText(`80% процентов цены получит сервер, а остальные 20% процентов **Владелец** сервера.`).setThumbnail(interaction.guild.iconURL())
    
        shop.forEach((it, i) => builder.addField(`\`#${i+1}\``, `> <@&${it.roleId}> - ${F.toMoneyString(it.cost, "guild", "secondary")}`));

        builder.interactionReply(interaction);
    }

})