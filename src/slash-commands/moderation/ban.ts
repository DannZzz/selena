import { CategoryChannel, NewsChannel, StageChannel, TextChannel, PublicThreadChannel, PrivateThreadChannel, VoiceChannel, Message, InteractionResponse, GuildMember } from "discord.js";
import { WarnReasonsChoices } from "../../docs/SlashOptions";
import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";

export default new SlashCommand({
    id: "ban",
    category: "Moderation",
    data: new SlashBuilder("BanMembers")
        .setName("ban")
        .setDescription("Забанить участника из сервера")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель")
            .setRequired(true))
        .addStringOption(o => o
            .setName("reason")
            .setDescription("Базовые причины")
            .addChoices(...toChoices(WarnReasonsChoices)))
        .addStringOption(o => o
            .setName("custom-reason")
            .setDescription("Расширенная причина"))
        .addStringOption(o => o
            .setName("message-delete-days")
            .setDescription("Удалить сообщения участника отправленные за последних дней")
            .setChoices(...toChoices([
                ["1", "1"],
                ["2", "2"],
                ["3", "3"],
                ["4", "4"],
                ["5", "5"],
                ["6", "6"],
                ["7", "7"],
            ])))
    ,
    botPermissions: "BanMembers",
    permissions: "BanMembers",
    async execute({ me, F, interaction, client, Builder, options, CustomEvent }) {
        const user = options.getUser("user");
        const reason = options.getString("custom-reason") || options.getString("reason") || null;
        const deleteMessageDays = +(options.getString("message-delete-days")) || null;

        const member = await F.fetchMember(interaction, user.id);
        if (!member) return;
        if (!member.bannable) return Builder.createEmbed().setError("Я не могу забанить этого участника.").setUser(interaction.user).interactionReply(interaction);

        try {
            await member.ban({ reason: reason || `Автор: ${interaction.user.tag}`, deleteMessageDays });
            CustomEvent.emit("ban", { targetId: member.id, authorId: interaction.user.id, reason, deleteMessageDays, autocomplete: false }, interaction.channel)
            return Builder.createEmbed().setSuccess(`Участник **${user.username}** был забанен.`).addField("❔ Причина", reason || "Не указана").setUser(interaction.user).interactionReply(interaction);
        } catch {
            return Builder.createEmbed().setError(`Я не смог забанить этого участника.`).setUser(interaction.user).interactionReply(interaction);

        }
    }
})