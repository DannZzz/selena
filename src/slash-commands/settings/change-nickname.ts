import { ActionRowBuilder, Message, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder } from "discord.js";
import { OneDayMs } from "../../config";
import { MaxNicknameLength } from "../../docs/CommandSettings";
import { DateTime } from "../../structures/Date";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "change-nickname",
    category: "Settings",
    data: new SlashBuilder ()
        .setName("change-nickname")
        .setDescription("Изменить никнейм")
    ,
    async execute ({interaction, Builder, Database, F, client, thisUser, thisUserGame}) {

        const button = (dis?: boolean) => Builder.createButton()
            .setCustomId("change-nickname")
            .setDisabled(dis ? Boolean(dis) : F.isLimited(thisUser.cooldowns.nicknameChange))
            .setStyle(F.isLimited(thisUser.cooldowns.nicknameChange) ? "Danger" : "Primary")
            .setLabel(F.isLimited(thisUser.cooldowns.nicknameChange) ? `Через ${new DateTime(thisUser.cooldowns.nicknameChange)}` : "Изменить")
            .toActionRow();

        const resp = await Builder.createEmbed()
            .setText(`Ваш текущий никнейм: ${thisUserGame.nickname}\n\nНикнейм можно менять один раз за 2 недели.`)
            .setTitle("Изменение Никнейма Игры")
            .setThumbnail(interaction.user.avatarURL())
            .interactionReply(interaction, {components: [button()], fetchReply: true}) as any as Message;

        const butCol = resp.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 30000
        });

        butCol.on("end", () => {
            resp.edit({components: [button(true)]});
        })

        butCol.on("collect", async b => {
            const textInput = new TextInputBuilder()
                .setCustomId("nickname")
                .setLabel("Новый Никнейм")
                .setMaxLength(MaxNicknameLength)
                .setMinLength(3)
                .setStyle(1)
                .setRequired(true)
                .setPlaceholder("Омега..");

                const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(textInput);

                const modal = new ModalBuilder().setCustomId("nickname-change-modal").setTitle("Изменение Никнейма").addComponents(actionRow);
                await b.showModal(modal);
                await b.awaitModalSubmit({time: 30000}).then(async submit => {
                    const _thisUser = await Database.get("User").findOrCreate("_id", submit.user.id);
                    if (F.isLimited(_thisUser.cooldowns.nicknameChange)) return Builder.createError("Подождите ещё " + new DateTime(_thisUser.cooldowns.nicknameChange), submit.user).interactionReply(submit, {ephemeral: true});
                    butCol.stop()
                    
                    const nickname = submit.fields.getTextInputValue("nickname");
                    await Promise.all([
                        Database.get("Game").updateOne({_id: submit.user.id}, {$set: {nickname}}),
                        Database.get("User").updateOne({_id: submit.user.id}, {$set: {['cooldowns.nicknameChange']: new Date(Date.now() + 14 * OneDayMs)}})
                    ]);
                    Builder.createEmbed()
                        .setText(`Новый Никнейм **${nickname}**.`)
                        .setUser(submit.user)
                        .interactionReply(submit, {ephemeral: true})
                })
        })
        
    }
})