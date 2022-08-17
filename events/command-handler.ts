import { GuildMemberRoleManager, Interaction, InteractionType } from "discord.js";
import { teamType } from "../config";
import { Levels } from "../custom-modules/Level-xp";
import Database from "../database/db";
import { CommandUseReward } from "../docs/CommandSettings";
import { SlashCollection } from "../handlers/handler";
import { Heroes } from "../heroes/Heroes";
import { Cooldown } from "../structures/Cooldown";
import { CustomEvent as CE } from "../structures/CustomEvent";
import { DiscordComponentBuilder } from "../structures/DiscordComponentBuilder";
import { Event } from "../structures/Event";
import { Functions } from "../structures/Functions";

export default new Event({
    event: "interactionCreate",
    async execute(client, int){
        if (int.type === InteractionType.ApplicationCommand) {
            const command = SlashCollection.get(int.commandName);
            if (command && !command.isPassive) {
                // builder
                const Builder = new DiscordComponentBuilder(client);
                // data to send
                const thisUserGame = await Database.get("Game").findOrCreate(int.user);
                const thisGuild = await Database.get("Guild").findOrCreate("_id", int.guildId);
                const thisUser = await Database.get("User").findOrCreate("_id", int.user.id);
                const isGuildPremium = thisGuild.premiumUntil ? thisGuild.premiumUntil > new Date() : false;
                const isUserVip = thisUser.vipUntil ? thisUser.vipUntil > new Date() : false;
                // dev permissions
                if (command.isDevOnly && teamType(int.user.id) !== "developer") return Builder.createEmbed().setError("Команда доступна только разработчикам.").interactionReply(int, {ephemeral: true});
                // premium check
                if (command.isPremium && !isGuildPremium) return Builder.createEmbed().setError("Эта команда для **Премиум** серверов.").interactionReply(int, {ephemeral: true});
                // command disabling
                const cmdData = thisGuild.commands[command.id];
                if (cmdData) {
                    if (cmdData.disabledGlobal) return Builder.createEmbed().setError("Эта команда отключена на всём сервере.").interactionReply(int, {ephemeral: true});
                    if ((cmdData.disabledChannels || []).includes(int.channel.id) || (cmdData.disabledChannels || []).includes(int.channel.parentId)) return Builder.createEmbed().setError("Эта команда отключена на этом канале.").interactionReply(int, {ephemeral: true});
                    if ((int.member.roles as GuildMemberRoleManager).cache.hasAny(...(cmdData.disabledRoles || []))) return Builder.createEmbed().setError("У вас роль, которая запрещает вам использовать эту команду.").interactionReply(int, {ephemeral: true});
                }
                // Custom Event
                const CustomEvent = new CE(int.guild, thisGuild);
                // owner commands
                if (command.onlyGuildOwner && int.user.id !== int.guild.ownerId) return Builder.createEmbed().setError("Команда доступна только владелецу сервера.").interactionReply(int, {ephemeral: true});
                // guild permissions
                if (!int.memberPermissions.has(command.permissions || [])) return Builder.createEmbed().setError("У вас недостаточно прав.").interactionReply(int, {ephemeral: true});
                if (!int.guild.members.me.permissions.has(command.botPermissions || [])) return Builder.createEmbed().setError("У меня недостаточно прав.").interactionReply(int, {ephemeral: true});
                // cooldowns
                const inCd = new Cooldown(command, int).isLimited()
                if (inCd) return Builder.createEmbed().setError(`Вы слишком часто пользуетесь этой командой, попробуйте ещё раз через **${inCd.toFixed(1)} секунд**.`).interactionReply(int, {ephemeral: true});
                // command executing
                command.execute({Levels: Levels, isUserVip, thisUserGame, Heroes: Heroes, commands: SlashCollection, Database, isGuildPremium, F: Functions, me: int.guild.members.me, interaction: int, Builder, options: int.options as any, client, thisUser, thisGuild, CustomEvent}).then(async () => {
                    // after command executing
                    // command reward with chance
                    if (command.isRewardAllowed) {
                        const random = client.util.random(0, 100);
                        if (random <= 5 && CommandUseReward) {
                            await Database.changeMoney({targetId: int.user.id, type: "user", moneyType: "primary", CustomEvent, amount: CommandUseReward})
                            Builder.createEmbed()
                                .setUser(int.user)
                                .setText(`Вам повезло, вы получаете ${Functions.toMoneyString(CommandUseReward, "user", "primary")}.`)
                                .sendToChannel(int.channel);
                        }
                    }
                })
            }
        }
    }
})