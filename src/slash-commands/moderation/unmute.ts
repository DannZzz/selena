import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "unmute",
    category: "Moderation",
    data: new SlashBuilder("ModerateMembers")
        .setName("unmute")
        .setDescription("Убрать ограничиние участника")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель")
            .setRequired(true))
    ,
    botPermissions: "ModerateMembers",
    permissions: "ModerateMembers",
    async execute ({me, F, interaction, client, Builder, options, CustomEvent}) {
        const user = options.getUser("user");
        
        let member = await F.fetchMember(interaction, user.id);
        if (!member) return;
        if (!member.moderatable) return Builder.createEmbed().setUser(interaction.user).setError("Я не могу убрать ограничение этого участника.").interactionReply(interaction);
        if (!member.isCommunicationDisabled()) return Builder.createEmbed().setUser(interaction.user).setError("Этот участник не ограничен.").interactionReply(interaction);
        try {
            await member.timeout(null);
            CustomEvent.emit("unmute", {authorId: interaction.user.id, targetId: user.id}, interaction.channel);
            return Builder.createEmbed().setUser(interaction.user).setSuccess(`Вы убрали ограничение **${user.username}**.`).interactionReply(interaction);
        } catch {
            return Builder.createEmbed().setUser(interaction.user).setError("Я не смог убрать ограничение этого участника.").interactionReply(interaction);
        }
    }
})