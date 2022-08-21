import { GuildMemberRoleManager, InteractionType } from "discord.js";
import Database from "../database/db";
import { Event } from "../structures/Event";

export default new Event({
    event: "interactionCreate",
    async execute (client, interaction) {
        if (interaction.type !== InteractionType.MessageComponent || !interaction.isButton()) return;
        const check = interaction?.customId?.split("-")[0];
        const roleId = interaction?.customId?.split("-")[1];
        if (check !== "color") return;
        await interaction.deferUpdate();
        if (!interaction.guild.members.me.permissions.has("ManageRoles")) return interaction.followUp({ content: "У меня недостаточно прав, обратитесь к администратору сервера.", ephemeral: true });
        const sd = await Database.get("Guild").findOrCreate("_id", interaction.guildId);

        const checkRole = sd?.colors?.find(obj => obj.id === roleId);
        const roleInGuild = interaction.guild.roles.cache.get(roleId);
        if (!checkRole || !roleInGuild) return interaction.followUp({ content: "Роль не найдена, обратитесь к администратору сервера.", ephemeral: true });
        let hasSelected = false;
        if ((interaction.member.roles as GuildMemberRoleManager).cache.has(roleId)) hasSelected = true;
        try {
            await (interaction.member.roles as GuildMemberRoleManager).remove(sd?.colors?.map(obj => obj.id));
            if (!hasSelected) {
                await (interaction.member.roles as GuildMemberRoleManager).add(roleInGuild);
                return interaction.followUp({ content: `У тебя новый цвет роли: ${roleInGuild}`, ephemeral: true });
            } else {
                return interaction.followUp({ content: `С тебя убраны все цвета.`, ephemeral: true });
            }

        } catch (e) {
            return interaction.followUp({ content: "Произошла ошибка, возможно у меня недостаточно прав.", ephemeral: true });
        }

    }
})