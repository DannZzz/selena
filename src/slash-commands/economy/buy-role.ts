import { GuildMember } from "discord.js";
import { RoleShopSlots } from "../../docs/CommandSettings";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "buy-role",
    category: "Economy",
    data: new SlashBuilder()
        .setName("buy-role")
        .setDescription("Купить роль")
        .addIntegerOption(o => o
            .setName("index")
            .setDescription("Номер # роли")
            .setRequired(true)),
    cooldown: 3,
    botPermissions: "ManageRoles",
    async execute ({Database, interaction, options, F, Builder, thisUser, thisGuild, isGuildPremium, CustomEvent}) {
        const index = options.getInteger("index") - 1;

        const maxLimit = isGuildPremium ? RoleShopSlots.premium : RoleShopSlots.basic;
        const shop = (thisGuild.roleShop || []).slice(0, maxLimit);
        const item = shop[index];
        if (!item) return Builder.createEmbed().setError("Предмет не найден!").setUser(interaction.user).interactionReply(interaction);

        const roles = await F.fetchCollection(interaction.guild, "roles");
        const role = roles.get(item.roleId);

        if (!role) return Builder.createEmbed().setUser(interaction.user).setError(`Роль не найдена, возможно она была удалена!`).interactionReply(interaction);
        const amount = item.cost;
        if (!role.editable) return Builder.createEmbed().setUser(interaction.user).setError(`Я не могу вам выдать эту роль, обращайтесь к администации!`).interactionReply(interaction);
        if (thisUser.secondary < amount) return Builder.createEmbed().setUser(interaction.user).setError(`Вам не хватает еще ${F.toMoneyString(amount - thisUser.secondary, "user", "secondary")}.`).interactionReply(interaction);
        
        try {
            await (interaction.member as GuildMember).roles.add(role.id);
            await Promise.all([
                Database.changeMoney({targetId: interaction.guildId, amount: F.percentOf(amount, 80), type: "guild", moneyType: "secondary", CustomEvent}),
                Database.changeMoney({targetId: interaction.user.id, amount: -amount, type: "user", moneyType: "secondary", CustomEvent}),
                Database.changeMoney({targetId: interaction.guild.ownerId, amount: F.percentOf(amount, 20), type: "user", moneyType: "secondary", CustomEvent})
            ])
            Builder.createEmbed().setUser(interaction.user).setSuccess(`Вы успешно купили роль **${role.name}** за ${F.toMoneyString(amount, "user", "secondary")}.`).interactionReply(interaction);
        } catch {
            return Builder.createEmbed().setUser(interaction.user).setError(`Я не могу вам выдать эту роль, обращайтесь к администации!`).interactionReply(interaction);
        }
    }
})