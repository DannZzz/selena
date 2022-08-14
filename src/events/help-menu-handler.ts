import { InteractionType } from "discord.js";
import { SlashCollection } from "../handlers/handler";
import { DiscordComponentBuilder } from "../structures/DiscordComponentBuilder";
import { Event } from "../structures/Event";
import { SlashCommandCategoryEnum } from "../structures/SlashCommand";

export default new Event({
    event: "interactionCreate",
    async execute(client, interaction) {
        if (interaction.type === InteractionType.MessageComponent) {
            if (interaction.isSelectMenu()) {
                if (interaction.customId === "help-menu") {
                    await interaction.deferUpdate()
                    const category = interaction.values[0];
                    const commands = SlashCollection.filter(c => c.category === category);
                    new DiscordComponentBuilder().createEmbed()
                        .setText(commands.map(c => `\`${c.data.name}\` - ${c.data.description}`).join("\n"))
                        .setTitle(SlashCommandCategoryEnum[category])
                        .setFooter(`Всего команд: ${commands.size}`, client.user.displayAvatarURL())
                        .interactionFollowUp(interaction, { ephemeral: true })
                }
            }
        }
    }
})