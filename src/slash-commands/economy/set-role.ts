import { GuildMember } from "discord.js";
import { MinRoleCost, RoleShopSlots } from "../../docs/CommandSettings";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "set-role",
    category: "Economy",
    data: new SlashBuilder("ManageGuild")
        .setName("set-role")
        .setDescription("Добавить новую роль в магазин")
        .addRoleOption(o => o
            .setName("role")
            .setDescription("Роль")
            .setRequired(true))
        .addIntegerOption(o => o
            .setName("cost")
            .setDescription("Цена")
            .setRequired(true))
    ,
    cooldown: 2,
    permissions: "ManageGuild",
    async execute ({Database, F, interaction, options, Builder, thisGuild, isGuildPremium}) {
        const role = options.getRole("role");
        const cost = options.getInteger("cost");
        const member = interaction.member as GuildMember
        const maxLimit = isGuildPremium ? RoleShopSlots.premium : RoleShopSlots.basic;
        const shop = (thisGuild.roleShop || []).slice(0, maxLimit);
        if (shop.length === maxLimit) return Builder.createEmbed().setUser(interaction.user).setError(`Нет свободных слотов.${isGuildPremium ? "" : `\n\nВы можете приобрести **Премиум**, чтобы увеличить количество слотов до ${RoleShopSlots.premium}.`}`).interactionReply(interaction);
        if (!member.permissions.has("Administrator") && member.roles.highest.position <= role.position) return Builder.createEmbed().setUser(interaction.user).setError("Эту роль вы не сможете добавить в магазин.").interactionReply(interaction);

        if (cost < MinRoleCost) return Builder.createEmbed().setError(`Минимальная цена для ролей - ${F.toMoneyString(MinRoleCost, "guild", "secondary")}.`).setUser(interaction.user).interactionReply(interaction);

        if (shop.find(r => r.roleId === role.id)) return Builder.createEmbed().setUser(interaction.user).setError("Эта роль уже добавлена в магазин.").interactionReply(interaction);

        await Database.get("Guild").updateOne({_id: interaction.guildId}, {$set: {roleShop: [{roleId: role.id, cost}, ...shop]}});

        Builder.createEmbed().setUser(interaction.user).setSuccess(`Роль **${role.name}** добавлена в магазин.`).addField(`Цена`, F.toMoneyString(cost, "guild", "secondary")).interactionReply(interaction);
    }
})