import { GiveawayEmoji } from "../docs/CommandSettings";
import { ContextMenuBuilder, ContextMenuCommand } from "../structures/ContextMenuCommand";

export default new ContextMenuCommand ({
    id: "reroll",
    data: new ContextMenuBuilder("ManageGuild")
        .setName("reroll")
        .setType(3)
    ,
    permissions: "ManageGuild",
    async execute ({targetMessage, interaction, client, Builder, Database}) {
        if (await Database.get("Giveaway").findOneFilter({_id: targetMessage.id, channelId: interaction.channelId, guildId: interaction.guildId})) return Builder.createEmbed().setUser(interaction.user).setError("Розыгрыш ещё не закончился!").interactionReply(interaction, {ephemeral: true});

        const users = await targetMessage.reactions.cache.get(GiveawayEmoji as any).users.fetch();

        if (!users.has(client.user.id)) return Builder.createEmbed().setUser(interaction.user).setError("Розыгрыш не найден.").interactionReply(interaction, {ephemeral: true});
        const _users = users.filter(p => !p.bot);

        if (_users.size === 0) return Builder.createEmbed().setUser(interaction.user).setError(`Никто не нажан на ${GiveawayEmoji}.`).interactionReply(interaction, {ephemeral: true});
        const user = _users.random();
        interaction.reply({content: "Выбран новый победитель.", ephemeral: true});
        targetMessage.reply(`🎉 Новый победитель: ${user}`)
    }
})