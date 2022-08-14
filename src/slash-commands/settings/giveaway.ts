import { stripIndents } from "common-tags";
import { Formatters, Message } from "discord.js";
import ms from "ms";
import { GiveawayEmoji } from "../../docs/CommandSettings";
import { Durations } from "../../docs/SlashOptions";
import { randomWinners } from "../../handlers/GiveawayHandler";
import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "giveaway",
    category: "Settings",
    data: new SlashBuilder("ManageGuild")
        .setName("giveaway")
        .setDescription("Розыгрыши")
        .addSubcommand(s => s
            .setName("create")
            .setDescription("Создать новый розыгрыш")
            .addStringOption(o => o
                .setName("duration")
                .setDescription("Длительность")
                .addChoices(...toChoices(Durations))
                .setRequired(true))
            .addIntegerOption(o => o
                .setRequired(true)
                .setName("winners")
                .setDescription("Победители"))
            .addStringOption(o => o
                .setName("reward")
                .setDescription("Приз (до 256 символов)")))
        .addSubcommand(s => s
            .setName("end")
            .setDescription("Закончить указанный розыгрыш")
            .addStringOption(o => o
                .setName("id")
                .setDescription("ID сообщение розыгрыша")
                .setRequired(true)))
        .addSubcommand(s => s
            .setName("reroll")
            .setDescription("Выбрать нового победителя")
            .addStringOption(o => o
                .setName("id")
                .setDescription("ID сообщение розыгрыша")
                .setRequired(true)))
    ,
    permissions: "ManageGuild",
    botPermissions: ["EmbedLinks", "AddReactions"],
    async execute ({interaction, options, Builder, Database, client}) {
        const cmd = options.getSubcommand();
        if (cmd === "create") {
            await interaction.deferReply({ephemeral: true});
    
            const duration = options.getString("duration");
            const winners = options.getInteger("winners");
            const reward = options.getString("reward") ? client.util.shorten(options.getString("reward"), 256) : null;
            const endsAt = new Date(Date.now() + ms(duration));
            if (winners <= 0) return Builder.createEmbed().setUser(interaction.user).setError("Миниманльное количество победителей - 1.").interactionReply(interaction);
            const builder = Builder.createEmbed().setThumbnail(client.user.avatarURL()).setTitle(`От ${interaction.guild.name}`).setText(stripIndents`
                • Победители: ${winners}
                • Автор: <@${interaction.user.id}>
                • Закончится: ${Formatters.time(endsAt)} (${Formatters.time(endsAt, "R")})
                ${reward ? `• Приз: ${reward}\n` : ""}
                Нажмите на ${GiveawayEmoji} чтобы участвовать.
            `)
    
            await builder.sendToChannel(interaction.channel, {content: `**${GiveawayEmoji}РОЗЫГРЫШ${GiveawayEmoji}**`}).then(async (msg) => {
                if (!msg) {
                    interaction.editReply("Я не смог отправить сообщение, проверьте мои права.")
                } else {
                    await msg.react(GiveawayEmoji);
                    await Database.get("Giveaway").createOne({_id: msg.id, guildId: interaction.guildId, channelId: interaction.channelId, authorId: interaction.user.id, endsAt, winners, reward});
                    interaction.editReply("Успешно создано!\n\nМожете закрыть этот сообщение.");
                }
            })
        } else if (cmd === "end") {
            const id = options.getString("id");
            let targetMessage: Message = null;
            try {
                targetMessage = await interaction.channel.messages.fetch(id);
            } catch {};
            if (!targetMessage) return Builder.createEmbed().setUser(interaction.user).setError("Розыгрыш не найден!").interactionReply(interaction, {ephemeral: true});
            const g = await Database.get("Giveaway").findOneFilter({_id: targetMessage.id, channelId: interaction.channelId, guildId: interaction.guildId});
            if (!g) return Builder.createEmbed().setUser(interaction.user).setError("Розыгрыш не найден!").interactionReply(interaction, {ephemeral: true});
            const users = (await targetMessage.reactions.cache.get(GiveawayEmoji as any).users.fetch()).filter(p => !p.bot)
            const message = targetMessage;
            if (users.size === 0) {
                const emb = Builder.createEmbed().setTitle(`Статус: Закончен`).setThumbnail(client.user.avatarURL()).setText(stripIndents`
                • Победители: Никто не участвовал
                • Автор: <@${g.authorId}>
                ${g.reward ? `• Приз: ${g.reward}` : ""}
                `).toEmbedBuilder();
                message.edit({embeds: [emb]});
                message.reply(`Никто не участвовал.`)
            } else if (users.size <= g.winners) {
                const emb = Builder.createEmbed().setTitle(`Статус: Закончен`).setThumbnail(client.user.avatarURL()).setText(stripIndents`
                • Победители: ${users.map(user => `<@${user.id}>`).join("\n")}
                • Автор: <@${g.authorId}>
                ${g.reward ? `• Приз: ${g.reward}` : ""}
                `).toEmbedBuilder();
                message.edit({embeds: [emb]});
                message.reply({content: `🎉 Победители: ${users.map(user => `<@${user.id}>`).join("\n")}`});
            } else {
                let winners = randomWinners(g.winners, users);
                const emb = Builder.createEmbed().setTitle(`Статус: Закончен`).setThumbnail(client.user.avatarURL()).setText(stripIndents`
                • Победители: ${winners.map(user => `<@${user.id}>`).join("\n")}
                • Автор: <@${g.authorId}>
                ${g.reward ? `• Приз: ${g.reward}` : ""}
                `).toEmbedBuilder();
                message.edit({embeds: [emb]});
                message.reply({content: `🎉 Победители: ${winners.map(user => `<@${user.id}>`).join("\n")}`});
            }
            await Database.get("Giveaway").deleteOne({_id: g._id, channelId: g.channelId, guildId: g.guildId});
            interaction.reply({content: "Успешно закончен.", ephemeral: true})
        } else if (cmd === "reroll") {
            const id = options.getString("id");
            let targetMessage: Message = null;
            try {
                targetMessage = await interaction.channel.messages.fetch(id);
            } catch {};
            if (!targetMessage) return Builder.createEmbed().setUser(interaction.user).setError("Розыгрыш не найден!").interactionReply(interaction, {ephemeral: true});
            if (await Database.get("Giveaway").findOneFilter({_id: targetMessage.id, channelId: interaction.channelId, guildId: interaction.guildId})) return Builder.createEmbed().setUser(interaction.user).setError("Розыгрыш ещё не закончился!").interactionReply(interaction, {ephemeral: true});
            const users = await targetMessage.reactions.cache.get(GiveawayEmoji as any).users.fetch();

            if (!users.has(client.user.id)) return Builder.createEmbed().setUser(interaction.user).setError("Розыгрыш не найден.").interactionReply(interaction, {ephemeral: true});
            const _users = users.filter(p => !p.bot);

            if (_users.size === 0) return Builder.createEmbed().setUser(interaction.user).setError(`Никто не нажан на ${GiveawayEmoji}.`).interactionReply(interaction, {ephemeral: true});
            const user = _users.random();
            interaction.reply({content: "Выбран новый победитель.", ephemeral: true});
            targetMessage.reply(`🎉 Новый победитель: ${user}`)
        }
        
    }
})