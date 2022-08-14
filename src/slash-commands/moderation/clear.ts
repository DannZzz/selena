import { CategoryChannel, NewsChannel, StageChannel, TextChannel, PublicThreadChannel, PrivateThreadChannel, VoiceChannel, Message, InteractionResponse, GuildMember } from "discord.js";
import { TextCommandChannel } from "../../structures/MainTypes";
import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "clear",
    category: "Moderation",
    data: new SlashBuilder("ManageMessages")
        .setName("clear")
        .setDescription("Удалить определённое количество сообщений")
        .addIntegerOption(o => o
            .setName("number")
            .setDescription("Количество сообщений")
            .setRequired(true))
        .addChannelOption(o => o
            .setName("channel")
            .setDescription("Текстовый Канал, в котором будет выполнено действие"))
    ,
    botPermissions: "ManageMessages",
    permissions: "ManageMessages",
    async execute ({me, F, interaction, client, Builder, options, CustomEvent}) {
        const messageNumber = options.getInteger("number");
        const optionChannel = options.getChannel("channel");
        const targetChannel = (optionChannel || interaction.channel) as CategoryChannel | NewsChannel | StageChannel | TextChannel | PublicThreadChannel | PrivateThreadChannel | VoiceChannel;

        if (messageNumber <= 0 || messageNumber > 1000) return Builder.createEmbed().setError("Количество сообщений не может быть отрицательным или 0, и максимум 1000.").setUser(interaction.user).interactionReply(interaction);
        if ((!targetChannel.isTextBased() && !targetChannel.isThread()) || !targetChannel.permissionsFor(me).has("ManageMessages") || !targetChannel.permissionsFor(interaction.member as GuildMember).has("ManageMessages")) return Builder.createEmbed().setUser(interaction.user).setError("Я не могу очистить указанный канал.").interactionReply(interaction);
        await interaction.deferReply({ephemeral: true});
        let temp = messageNumber;
        if (temp <= 100) {
            try {
                const messages = await targetChannel.bulkDelete(temp, true);
                CustomEvent.emit("messageClear", {authorId: interaction.user.id, channelId: targetChannel.id, request: temp, deleted: messages.size}, interaction.channel);
                Builder.createEmbed().clear().setSuccess(`Успешно удалены **${messages.size}** сообщений.`).setUser(interaction.user).editReply(interaction);
            } catch (e) {
                console.log(e);
                return Builder.createEmbed().clear().setSuccess(`Я не смог очистить канал.`).setUser(interaction.user).editReply(interaction);
            }
        } else {
            let sum = 0;
            while (temp > 0) {
                try {
                    const messages = await targetChannel.bulkDelete(temp <= 100 ? temp : 100 , true);
                    sum += messages.size;
                    if (messages.size < (temp <= 100 ? temp : 100)) {
                        return Builder.createEmbed().clear().setSuccess(`Успешно удалены **${sum}** сообщений.`).setUser(interaction.user).editReply(interaction);
                    }
                    sum -= 100;
                } catch (e) {
                    console.log(e);
                    return Builder.createEmbed().clear().setSuccess(`Я не смог очистить канал.`).setUser(interaction.user).editReply(interaction);
                }
            }
            return Builder.createEmbed().clear().setSuccess(`Успешно удалены **${sum}** сообщений.`).setUser(interaction.user).editReply(interaction);
        }
    }
})