import { stripIndents } from "common-tags";
import { ChannelType, Collection, GuildBan, GuildBasedChannel, GuildMember, GuildMemberRoleManager, GuildTextBasedChannel, NonThreadGuildBasedChannel, Role } from "discord.js";
import { CommandSettings } from "../../database/models/Guild";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "disable-command",
    category: "Settings",
    autocomplete: "command",
    data: new SlashBuilder("ManageGuild")
        .setName("disable-command")
        .setDescription("Включить/Отключить команду")
        .addSubcommand(s => s
            .setName("channel")
            .setDescription("Включить/Отключить команду на канале")
            .addStringOption(o => o
                .setName("command")
                .setAutocomplete(true)
                .setDescription("Команда")
                .setRequired(true))
            .addChannelOption(o => o
                .setName("channel")
                .setDescription("Канал")
                .setRequired(true)))
        .addSubcommand(s => s
            .setName("role")
            .setDescription("Включить/Отключить команду для участников с опред. ролями")
            .addStringOption(o => o
                .setName("command")
                .setAutocomplete(true)
                .setDescription("Команда")
                .setRequired(true))
            .addRoleOption(o => o
                .setName("role")
                .setDescription("Роль")
                .setRequired(true)))
        .addSubcommand(s => s
            .setName("global")
            .setDescription("Включить/Отключить команду глобально на всём сервере")
            .addStringOption(o => o
                .setName("command")
                .setAutocomplete(true)
                .setDescription("Команда")
                .setRequired(true)))
        .addSubcommand(s => s
            .setName("check")
            .setDescription("Открыть настройки доступности команды")
            .addStringOption(o => o
                .setName("command")
                .setAutocomplete(true)
                .setDescription("Команда")
                .setRequired(true)))
        
    ,
    permissions: "ManageGuild",
    async execute ({interaction, options, client, commands, thisGuild, Builder, Database}) {
        const subcmd = options.getSubcommand();

        const command = options.getString("command")?.toLowerCase();
        const role = options.getRole("role") as Role;
        const channel = options.getChannel("channel") as GuildTextBasedChannel;
        const cmd = commands.find(c => c.data.name === command);
        if (!cmd) return Builder.createEmbed().setUser(interaction.user).setError(`Команда \`${command}\` не найдена!`).interactionReply(interaction);
        const data: CommandSettings = thisGuild.commands[cmd.id] || {disabledChannels: [], disabledRoles: [], disabledGlobal: false};
        if (subcmd === "channel") {
            if ([ChannelType.DM, ChannelType.GroupDM, ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(channel.type)) return Builder.createEmbed().setUser(interaction.user).setError(`Канал **${channel.name}** не текстовый.`).interactionReply(interaction);
            if (!(interaction.member as GuildMember).permissions.has("Administrator") && !channel.permissionsFor(interaction.user).has("ManageChannels")) return Builder.createEmbed().setUser(interaction.user).setError("Этот канал не доступен.").interactionReply(interaction);
            if (data.disabledChannels.includes(channel.id)) {
                const newChannels = client.util.remove(data.disabledChannels, {indexes: [], elements: [channel.id]});
                data.disabledChannels = newChannels;
                await Database.get("Guild").updateOne({_id: interaction.guildId}, {$set: {[`commands.${cmd.id}`]: data}});
                Builder.createEmbed().setUser(interaction.user).setSuccess(`Команда **${command}** разблокирована для **${channel.name}**.`).interactionReply(interaction);
            } else {
                const newChannels = [...data.disabledChannels, channel.id];
                data.disabledChannels = newChannels;
                await Database.get("Guild").updateOne({_id: interaction.guildId}, {$set: {[`commands.${cmd.id}`]: data}});
                Builder.createEmbed().setUser(interaction.user).setSuccess(`Команда **${command}** заблокирована для **${channel.name}**.`).interactionReply(interaction);
            }
        } else if (subcmd === "role") {
            if (!(interaction.member as GuildMember).permissions.has("Administrator") && role.position >= (interaction.member.roles as GuildMemberRoleManager).highest.position) return Builder.createEmbed().setUser(interaction.user).setError("Эта роль не доступна.").interactionReply(interaction);
            if (data.disabledRoles.includes(role.id)) {
                const newChannels = client.util.remove(data.disabledRoles, {indexes: [], elements: [role.id]});
                data.disabledRoles = newChannels;
                await Database.get("Guild").updateOne({_id: interaction.guildId}, {$set: {[`commands.${cmd.id}`]: data}});
                Builder.createEmbed().setUser(interaction.user).setSuccess(`Команда **${command}** разблокирована для **${role.name}**.`).interactionReply(interaction);
            } else {
                const newChannels = [...data.disabledRoles, role.id];
                data.disabledRoles = newChannels;
                await Database.get("Guild").updateOne({_id: interaction.guildId}, {$set: {[`commands.${cmd.id}`]: data}});
                Builder.createEmbed().setUser(interaction.user).setSuccess(`Команда **${command}** заблокирована для **${role.name}**.`).interactionReply(interaction);
            }
        } else if (subcmd === "global") {
            if (data.disabledGlobal) {
                data.disabledGlobal = false;
                await Database.get("Guild").updateOne({_id: interaction.guildId}, {$set: {[`commands.${cmd.id}`]: data}});
                Builder.createEmbed().setUser(interaction.user).setSuccess(`Команда **${command}** разблокирована на всём сервере.`).interactionReply(interaction);
            } else {
                data.disabledGlobal = true;
                await Database.get("Guild").updateOne({_id: interaction.guildId}, {$set: {[`commands.${cmd.id}`]: data}});
                Builder.createEmbed().setUser(interaction.user).setSuccess(`Команда **${command}** заблокирована на всём сервере.`).interactionReply(interaction);
            }
        } else if (subcmd === "check") {
            await interaction.deferReply();
            const server = interaction.guild;
            let channels: Collection<string, GuildBasedChannel> = server.channels.cache;
            let roles: Collection<string, Role> = server.roles.cache;
            try {
                roles = await server.roles.fetch();
            } catch {}
            try {
                channels = await server.channels.fetch()
            } catch {}
            const validChannels = data.disabledChannels.filter(id => channels.has(id)).map(id => `\`${channels.get(id).name}\``);
            const validRoles = data.disabledRoles.filter(id => roles.has(id)).map(id => `\`${roles.get(id).name}\``);

            Builder.createEmbed().setUser(interaction.user).setAuthor(`Команда: ${command}`).setText(stripIndents`
            Запрещена на всем сервере: **${data.disabledGlobal ? "Да" : "Нет"}**

            Запрещённые каналы: ${validChannels.length > 0 ? validChannels : "Не найдены"}

            Запрещённые роли: ${validRoles.length > 0 ? validRoles : "Не найдены"}
            `).editReply(interaction);
        }
        
    }
})