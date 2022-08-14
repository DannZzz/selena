import { CategoryChannel, NewsChannel, StageChannel, TextChannel, PublicThreadChannel, PrivateThreadChannel, VoiceChannel, Message, InteractionResponse, GuildMember } from "discord.js";
import { WarnReasonsChoices } from "../../docs/SlashOptions";
import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";

export default new SlashCommand({
    id: "kick",
    category: "Moderation",
    data: new SlashBuilder("KickMembers")
        .setName("kick")
        .setDescription("Выгнать участника из сервера")
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
    ,
    botPermissions: "KickMembers",
    permissions: "KickMembers",
    async execute({ me, F, interaction, client, Builder, options, CustomEvent }) {
        const user = options.getUser("user");
        const reason = options.getString("custom-reason") || options.getString("reason") || null;

        const member = await F.fetchMember(interaction, user.id);
        if (!member) return;
        if (!member.kickable) return Builder.createEmbed().setError("Я не могу выгнать этого участника.").setUser(interaction.user).interactionReply(interaction);

        try {
            await member.kick(reason || `Автор: ${interaction.user.tag}`);
            CustomEvent.emit("kick", { targetId: member.id, authorId: interaction.user.id, reason, autocomplete: false }, interaction.channel)
            return Builder.createEmbed().setSuccess(`Участник **${user.username}** был выгнан.`).addField("❔ Причина", reason || "Не указана").setUser(interaction.user).interactionReply(interaction);
        } catch {
            return Builder.createEmbed().setError(`Я не смог выгнать этого участника.`).setUser(interaction.user).interactionReply(interaction);

        }
    }
})