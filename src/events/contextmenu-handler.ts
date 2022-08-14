import { GuildMemberRoleManager } from "discord.js";
import Database from "../database/db";
import { CommandUseReward } from "../docs/CommandSettings";
import { MessageContextMenuCollection, SlashCollection } from "../handlers/handler";
import { Cooldown } from "../structures/Cooldown";
import { CustomEvent } from "../structures/CustomEvent";
import { DiscordComponentBuilder } from "../structures/DiscordComponentBuilder";
import { Event } from "../structures/Event";
import { Functions } from "../structures/Functions";

export default new Event({
    event: "interactionCreate",
    async execute (client, interaction) {
        if (interaction.isMessageContextMenuCommand()) {
            const command = MessageContextMenuCollection.get(interaction.commandName);
            if (command) {
                // builder
                const Builder = new DiscordComponentBuilder(client);
                // data to send
                const thisUser = await Database.get("User").findOrCreate(interaction.user);
                const thisGuild = await Database.get("Guild").findOrCreate("_id", interaction.guildId);
                const isGuildPremium = thisGuild.premiumUntil ? thisGuild.premiumUntil > new Date() : false;
                // premium check
                if (command.isPremium && !isGuildPremium) return Builder.createEmbed().setError("Эта команда для **Премиум** серверов.").interactionReply(interaction, {ephemeral: true});
                // command disabling
                const cmdData = thisGuild.commands[command.id];
                if (cmdData) {
                    if (cmdData.disabledGlobal) return Builder.createEmbed().setError("Эта команда отключена на всём сервере.").interactionReply(interaction, {ephemeral: true});
                    if ((cmdData.disabledChannels || []).includes(interaction.channel.id) || (cmdData.disabledChannels || []).includes(interaction.channel.parentId)) return Builder.createEmbed().setError("Эта команда отключена на этом канале.").interactionReply(interaction, {ephemeral: true});
                    if ((interaction.member.roles as GuildMemberRoleManager).cache.hasAny(...(cmdData.disabledRoles || []))) return Builder.createEmbed().setError("У вас роль, которая запрещает вам использовать эту команду.").interactionReply(interaction, {ephemeral: true});
                }
                // guild permissions
                if (!interaction.memberPermissions.has(command.permissions || [])) return Builder.createEmbed().setError("У вас недостаточно прав.").interactionReply(interaction, {ephemeral: true});
                if (!interaction.guild.members.me.permissions.has(command.botPermissions || [])) return Builder.createEmbed().setError("У меня недостаточно прав.").interactionReply(interaction, {ephemeral: true});
                // command executing
                command.execute({targetMessage: interaction.targetMessage, commands: MessageContextMenuCollection, Database, isGuildPremium, F: Functions, me: interaction.guild.members.me, interaction: interaction, Builder, client, thisUser, thisGuild, CustomEvent: new CustomEvent(interaction.guild, thisGuild)}).then(async () => {
                    // after command executing
                    // command reward with chance
                    if (command.isRewardAllowed) {
                        const random = client.util.random(0, 100);
                        if (random <= 5 && CommandUseReward) {
                            await Database.get("User").updateOne({"_id": interaction.user.id}, {$inc: {userMoney: CommandUseReward}});
                            Builder.createEmbed()
                                .setUser(interaction.user)
                                .setText(`Вам повезло, вы получаете ${Functions.toMoneyString(CommandUseReward, "user", "primary")}.`)
                                .sendToChannel(interaction.channel);
                        }
                    }
                })
            }
        }
    }
})