import { stripIndents } from "common-tags";
import { AttachmentBuilder, InteractionType } from "discord.js";
import { SUPPORT_SERVER_LINK } from "../config";
import { SlashCollection } from "../handlers/handler";
import { DiscordComponentBuilder } from "../structures/DiscordComponentBuilder";
import { Event } from "../structures/Event";
import { SlashCommandCategoryEnum } from "../structures/SlashCommand";

export default new Event({
    event: "interactionCreate",
    async execute(client, interaction) {
        if (interaction.type === InteractionType.MessageComponent) {
            if (interaction.isButton()) {
                if (interaction.customId === "crystal-buying-info") {
                    await interaction.deferUpdate()
                    const att = new AttachmentBuilder("./assets/donate_example.png", {name: "donate.png"})
                    new DiscordComponentBuilder().createEmbed()
                        .setText(stripIndents`
                        В поле имени, укажите ваш ID Дискорда.
                        А в поле сообщение номер предмета (указан выше), с \`#\` (например: \`#4\`).
                        Если всё указано верно, получите кристаллы мгновенно!
                        А если не получили, обратитесь к [нам](${SUPPORT_SERVER_LINK}).
                        `)
                        .setImage(`attachment://${att.name}`)
                        .setTitle("Покупка Кристаллов")
                        .setFooter(`Мы не несем ответственность за ваши потерянные деньги.`, client.user.displayAvatarURL())
                        .interactionFollowUp(interaction, { ephemeral: true, files: [att] })
                }
            }
        }
    }
})