import { Formatters } from "discord.js";
import ms from "ms";
import { WarnReasonsChoices, Durations } from "../../docs/SlashOptions";
import { Punishment } from "../../structures/CustomEventTypes";
import { Pagination } from "../../structures/Pagination";
import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";

export default new SlashCommand({
    id: "warns",
    category: "Moderation",
    data: new SlashBuilder("ModerateMembers")
        .setName("warns")
        .setDescription("Предупреждения")
        .addSubcommand(s => s
            .setName("add")
            .setDescription("Давать предупреждение участнику")
            .addUserOption(o => o
                .setName("user")
                .setRequired(true)
                .setDescription("Цель"))
            .addStringOption(o => o
                .setName("reason")
                .setDescription("Базовые причины")
                .addChoices(...toChoices(WarnReasonsChoices)))
            .addStringOption(o => o
                .setName("custom-reason")
                .setDescription("Расширенная причина"))
            .addStringOption(o => o
                .setName("duration")
                .setDescription("Длителность (после опред. времени случай будет убран) для Премиум Серверов")
                .addChoices(...toChoices(Durations))))
        .addSubcommand(s => s
            .setName("list")
            .setDescription("Открыть список случай"))
        .addSubcommand(s => s
            .setName("remove")
            .setDescription("Убрать случай")
            .addIntegerOption(o => o
                .setName("case")
                .setDescription("Номер случаи")
                .setRequired(true)))
        .addSubcommand(s => s
            .setName("user")
            .setDescription("Открыть все случаи связанные с опред. участником")
            .addUserOption(o => o
                .setName("user")
                .setDescription("Цель")
                .setRequired(true)))
        .addSubcommand(s => s
            .setName("reset-user")
            .setDescription("Убрать все случаи связанные с опред. участником")
            .addUserOption(o => o
                .setName("user")
                .setDescription("Цель")
                .setRequired(true)))
        .addSubcommand(s => s
            .setName("reset-all")
            .setDescription("Сбросить все случаи"))
    ,
    permissions: "ModerateMembers",
    async execute({ options, F, interaction, Builder, thisGuild, client, Database, isGuildPremium, CustomEvent }) {
        const cmd = options.getSubcommand();
        const user = options.getUser("user");
        const addReason = options.getString("custom-reason") || options.getString("reason") || null;
        const addDuration = options.getString("duration") || null;
        const removeCase = options.getInteger("case");

        const warns = F.validWarns(thisGuild.punishments);
        if (cmd === "add") {
            const member = await F.fetchMember(interaction, user.id);
            if (!member) return;
            await Database.get("Guild").updateOne({ _id: interaction.guildId }, { $push: { punishments: { case: (thisGuild.punishments || []).length + 1, targetId: user.id, reason: addReason, until: addDuration && isGuildPremium ? new Date(Date.now() + ms(addDuration)) : null, moderatorId: interaction.user.id, removed: false, createdAt: new Date(), autocomplete: false } as Punishment } });
            CustomEvent.emit("warnCreate", {
                case: (thisGuild.punishments || []).length + 1,
                targetId: user.id, reason: addReason,
                until: addDuration && isGuildPremium ? new Date(Date.now() + ms(addDuration)) : null,
                moderatorId: interaction.user.id,
                removed: false,
                createdAt: new Date(),
                autocomplete: false
            }, interaction.channel);
            
            const emb = Builder.createEmbed()
                .setUser(interaction.user)
                .setTitle(`❕ Случаи \`#${F.formatNumber((thisGuild.punishments || []).length + 1)}\``)
                .setText(`**${user.username}** получает предупреждение!`)
                .addField("❔ Причина", addReason || "Не указана");

            if (addDuration) emb.addField("⏳ Длительность", isGuildPremium ? `${Durations.find(arr => arr[1] === addDuration)[0]}` : `Ошибка: Это не **Премиум** Сервер`);
            emb.interactionReply(interaction);
        } else if (cmd === "list") {
            let embeds = [];
            for (let i = 0; i < warns.length; i += 5) {
                const sliced = warns.slice(i, i + 5);
                const texted = sliced.map(p => {
                    let main = [`\`#${F.formatNumber(p.case)}\` (${Formatters.time(p.createdAt, "D")})`];
                    main.push(`  - Участник: <@${p.targetId}>`);
                    main.push(`  - Модератор: <@${p.moderatorId}>`);
                    if (p.until) main.push(`  - Действует до: ${Formatters.time(p.until, "D")}`)
                    if (p.reason) main.push(`  - Причина: \`${p.reason}\``)
                    return main.join("\n");
                })

                embeds.push(
                    Builder.createEmbed().clear()
                        .setAuthor(`❕ Случаи сервера: ${interaction.guild.name}`)
                        .setText(texted.join("\n\n"))
                        .toEmbedBuilder()
                )
            }

            if (embeds.length === 0) embeds.push(
                Builder.createEmbed().clear()
                    .setAuthor(`❕ Случаи сервера: ${interaction.guild.name}`)
                    .setText("Пусто..")
                    .toEmbedBuilder()
            );

            new Pagination({ embeds, validIds: [interaction.user.id], interaction }).createAdvancedPagination();
        } else if (cmd === "remove") {

            const thisCaseIndex = warns.findIndex(p => p.case === removeCase);
            if (thisCaseIndex === -1) return Builder.createEmbed().setError("Случай не найден.").setUser(interaction.user).interactionReply(interaction);

            let thisCase = warns[thisCaseIndex];
            thisCase.removed = true;
            
            await Database.get("Guild").updateOne({ _id: interaction.guildId }, { $set: { [`punishments.${thisCaseIndex}.removed`]: true } });

            CustomEvent.emit("warnRemove", {
                ...thisCase,
                authorId: interaction.user.id
            }, interaction.channel)
            
            Builder.createEmbed().setSuccess(`Случай \`#${removeCase}\` убран.`).setUser(interaction.user).interactionReply(interaction);
        } else if (cmd === "user") {
            if (!user) return Builder.createEmbed().setUser(interaction.user).setError('Участник не найден.').interactionReply(interaction);
            const user_s = warns.filter(p => p.targetId === user.id);

            let embeds = [];
            for (let i = 0; i < user_s.length; i += 5) {
                const sliced = user_s.slice(i, i + 5);
                const texted = sliced.map(p => {
                    let main = [`\`#${F.formatNumber(p.case)}\` (${Formatters.time(p.createdAt, "D")})`];
                    main.push(`  - Модератор: <@${p.moderatorId}>`);
                    if (p.until) main.push(`  - Действует до: ${Formatters.time(p.until, "D")}`)
                    if (p.reason) main.push(`  - Причина: \`${p.reason}\``)
                    return main.join("\n");
                })

                embeds.push(
                    Builder.createEmbed().clear()
                        .setAuthor(`❕ Случаи: ${user.tag}`, user.displayAvatarURL())
                        .setText(texted.join("\n\n"))
                        .toEmbedBuilder()
                )
            }

            if (embeds.length === 0) embeds.push(
                Builder.createEmbed().clear()
                    .setAuthor(`❕ Случаи: ${user.tag}`, user.displayAvatarURL())
                    .setText("Пусто..")
                    .toEmbedBuilder()
            );

            new Pagination({ embeds, validIds: [interaction.user.id], interaction }).createAdvancedPagination();
        } else if (cmd === "reset-user") {
            if (!user) return Builder.createEmbed().setUser(interaction.user).setError('Участник не найден.').interactionReply(interaction);
            const user_s = warns.filter(p => p.targetId === user.id);
            if (user_s.length === 0) return Builder.createEmbed().setUser(interaction.user).setError(`Пока что нет случаи связанные с **${user.username}**.`).interactionReply(interaction);
            await Database.get("Guild").updateOne({_id: interaction.guildId}, {$set: {punishments: (thisGuild.punishments || []).map(p => {
                if (p.targetId === user.id) p.removed = true;
                return p;
            })}})
            CustomEvent.emit('warnResetUser', {warns: user_s, targetId: user.id, authorId: interaction.user.id}, user, interaction.channel);
            Builder.createEmbed().setUser(interaction.user).setSuccess(`Убраны все случаи связанные с **${user.username}**.`).interactionReply(interaction);
        } else if (cmd === "reset-all") {
            CustomEvent.emit("warnResetAll", {warns, authorId: interaction.user.id}, interaction.channel)
            await Database.get("Guild").updateOne({_id: interaction.guildId}, {$set: {punishments: []}})
            Builder.createEmbed().setUser(interaction.user).setSuccess(`Успешно сброшены все случаи сервера.`).interactionReply(interaction);
        }        


    }
})