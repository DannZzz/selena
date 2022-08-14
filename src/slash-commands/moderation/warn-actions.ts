import ms from "ms";
import { PunishmentActionsSlots } from "../../docs/CommandSettings";
import { Durations } from "../../docs/SlashOptions";
import { PunishmentAction } from "../../structures/CustomEventTypes";
import { ObjectType } from "../../structures/MainTypes";
import { SlashBuilder, SlashCommand, toChoices } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "warn-actions",
    category: "Moderation",
    data: new SlashBuilder("ManageGuild")
        .setName("warn-actions")
        .setDescription("Действия при случий")
        .addSubcommand(s => s
            .setName("add")
            .setDescription("Добавить действие")
            .addIntegerOption(o => o
                .setName("amount")
                .setDescription("Количество случай, при получении предупреждений, будет выполнено")
                .setRequired(true))
            .addStringOption(o => o
                .setName("action")
                .setDescription("Действие")
                .setRequired(true)
                .setChoices(...toChoices([
                    ["Ограничить (mute)", "mute"],
                    ["Выгнать", "kick"],
                    ["Забанить", "ban"]
                ])))
            .addStringOption(o => o
                .setName("duration")
                .setDescription("Длительность для ограничение (mute)")
                .setChoices(...toChoices(Durations))))
        .addSubcommand(s => s
            .setName("remove")
            .setDescription("Убрать действие")
            .addIntegerOption(o => o
                .setName("index")
                .setDescription("Номер действие")
                .setRequired(true)))
        .addSubcommand(s => s
            .setName("list")
            .setDescription("Открыть список всех действий"))            
    ,
    cooldown: 3,
    permissions: "ManageGuild",
    async execute ({interaction, thisGuild, F, options, isGuildPremium, Builder, Database, client }) {
        const cmd = options.getSubcommand();
        const amount = options.getInteger("amount");
        const action = options.getString("action") as PunishmentAction['type'];
        const muteDuration = options.getString("duration");
        const index = options.getInteger("index");
        
        const maxLimit = isGuildPremium ? PunishmentActionsSlots.premium : PunishmentActionsSlots.basic;
        const actions: PunishmentAction[] = [];
        (thisGuild.punishmentActions || []).forEach((pa) => {
            if (actions.every(li => li.amount !== pa.amount) && actions.length < maxLimit) actions.push(pa);
        });
        
        if (cmd === "add") {
            if (actions.length === maxLimit) return Builder.createEmbed().setError(`Больше нет места.${isGuildPremium ? "" : `\n\nВы можете приобрести **Премиум**, чтобы увеличить места до ${PunishmentActionsSlots.premium}.`}`).setUser(interaction.user).interactionReply(interaction);
            if (amount < 1) return Builder.createEmbed().setError("Минимальное количество случай - 1.").setUser(interaction.user).interactionReply(interaction);
            if (actions.some(ap => ap.amount === amount)) return Builder.createEmbed().setError("Уже есть действие со стольким количеством случаи.").setUser(interaction.user).interactionReply(interaction);
            if (action === "mute" && !muteDuration) return Builder.createEmbed().setError("Вы указали действию **Ограничение**, но не указали длительность.").setUser(interaction.user).interactionReply(interaction);
            await Database.get("Guild").updateOne({_id: interaction.guildId}, {$push: {punishmentActions: {amount, type: action, muteDuration} as PunishmentAction }});

            Builder.createEmbed().setUser(interaction.user).setSuccess(`Новое действие успешно добавлено.`).interactionReply(interaction);
        } else if (cmd === "list") {
            await interaction.deferReply();
            const toRu: ObjectType<PunishmentAction['type'], string> = {
                ban: "Забанить",
                kick: "Выгнать",
                mute: "Ограничить"
            }
            
            const mainBuilder = Builder.createEmbed().setTitle("🚫 Действия при случаи").setUser(interaction.user).setColor();
            if (actions.length !== 0) {
                actions.forEach((pa, i) => mainBuilder.addField(`\`#${i+1}\` Количество: ${pa.amount}`, `Действие: ${toRu[pa.type]}${pa.type === "mute" ? `\nДлительность: ${Durations.find(arr => arr[1] === pa.muteDuration)[0]}` : ""}`, false));
            } else {
                mainBuilder.setText("Пусто..")
            }
            mainBuilder.editReply(interaction);
        } else if (cmd === "remove") {
            if (!actions[index-1]) return Builder.createEmbed().setUser(interaction.user).setError("Действие не найдено.").interactionReply(interaction);
            const removed = client.util.remove(actions, {indexes: [index-1], elements: []});
            await Database.get("Guild").updateOne({_id: interaction.guildId}, {$set: {punishmentActions: removed }});
            Builder.createEmbed().setUser(interaction.user).setSuccess(`Действие успешно убрано.`).interactionReply(interaction);
        }

        
    }
})