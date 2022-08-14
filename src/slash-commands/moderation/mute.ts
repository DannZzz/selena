import ms from "ms";
import { Durations, WarnReasonsChoices } from "../../docs/SlashOptions";
import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";

export default new SlashCommand({
    id: "mute",
    category: "Moderation",
    data: new SlashBuilder("ModerateMembers")
        .setName("mute")
        .setDescription("Ограничить участника")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель")
            .setRequired(true))
        .addStringOption(o => o
            .setName("duration")
            .setDescription("Длителность")
            .setRequired(true)
            .setChoices(...toChoices(Durations)))
        .addStringOption(o => o
            .setName("reason")
            .setDescription("Базовые причины")
            .addChoices(...toChoices(WarnReasonsChoices)))
        .addStringOption(o => o
            .setName("custom-reason")
            .setDescription("Расширенная причина")),
    botPermissions: "ModerateMembers",
    permissions: "ModerateMembers",
    async execute({ me, F, interaction, client, Builder, options, CustomEvent }) {
        const user = options.getUser("user");
        const duration = options.getString("duration");
        const reason = options.getString("custom-reason") || options.getString("reason") || null;

        let member = await F.fetchMember(interaction, user.id);
        if (!member) return;
        if (!member.moderatable) return Builder.createEmbed().setUser(interaction.user).setError("Я не могу ограничить этого участника.").interactionReply(interaction);
        try {
            await member.timeout(ms(duration), reason || "Автор: " + interaction.user.tag);
            CustomEvent.emit("mute", { duration: ms(duration), reason, moderatorId: interaction.user.id, targetId: user.id, autocomplete: false }, interaction.channel);
            return Builder.createEmbed().setUser(interaction.user).setSuccess(`Вы ограничили **${user.username}**.`).addField("⏳ Длительность", `${Durations.find(arr => arr[1] === duration)[0]}`).addField("❔ Причина", reason || "Не указана").interactionReply(interaction);
        } catch {
            return Builder.createEmbed().setUser(interaction.user).setError("Я не смог ограничить этого участника.").interactionReply(interaction);
        }
    }
})