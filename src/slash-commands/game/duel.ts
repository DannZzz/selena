import { ActionRowBuilder } from "@discordjs/builders";
import { ButtonInteraction, Collection, Message, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder } from "discord.js";
import { FightTemplate } from "../../custom-modules/fight-template";
import { Levels } from "../../custom-modules/Level-xp";
import { MongoHero } from "../../database/models/Game";
import { UserXpAfterWin, HeroXpAfterWin, DuelMoney, XpEmoji } from "../../docs/CommandSettings";
import { HeroId, HeroSkinRarityNames } from "../../heroes/heroes-attr";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
const _duels = new Collection<`${string}-${string}`, {[k: string]: {id: HeroId, mongo:MongoHero, nickname: string, userId: string}}>()

export default new SlashCommand({
    id: "duel",
    category: "Game",
    isRewardAllowed: true,
    data: new SlashBuilder()
        .setName("duel")
        .setDescription("Звать человека на дуэль")
        .addUserOption(o => o
            .setName('user')
            .setDescription("Цель")
            .setRequired(true))
    ,
    cooldown: 3,
    async execute({ interaction, Builder, client, F, Database, options, Heroes, CustomEvent }) {
        const user = options.getUser("user");
        if (user.bot || user.id === interaction.user.id) return Builder.createEmbed().setUser(interaction.user).setError("Укажите другого участника!").interactionReply(interaction);
        if (_duels.some(duel => user.id in duel || interaction.user.id in duel)) return Builder.createEmbed().setUser(interaction.user).setError("Вы или это пользователь в настоящее время соревнуется!").interactionReply(interaction);
        const buttons = (dis?: boolean) => [
            Builder.createButton()
                .setCustomId("pick-hero")
                .setStyle("Primary")
                .setDisabled(Boolean(dis))
                .setLabel("Выбрать героя")
                .toButtonBuilder(),
            Builder.createButton()
                .setCustomId("cancel-duel")
                .setStyle("Danger")
                .setLabel("Отменить дуэль")
                .setDisabled(Boolean(dis))
                .toButtonBuilder(),
        ];
        _duels.set(`${interaction.user.id}-${user.id}`, {[interaction.user.id]: null, [user.id]: null});
        const _msg = await Builder.createEmbed()
            .setTitle("Подготовка...")
            .setText(`${interaction.user} и ${user}, выберите героев...`)
            .interactionReply(interaction, {fetchReply: true, components: [new ActionRowBuilder().addComponents(buttons()) as any]}) as any as Message;

        const c = _msg.createMessageComponentCollector({
            filter: i => [user.id, interaction.user.id].includes(i.user.id),
            time: 30000
        });


        let jstEnd = false;

        c.on("end", () => {
            _msg.edit({components: [new ActionRowBuilder().addComponents(buttons(true)) as any]})
            if (jstEnd) return;
            _duels.delete(`${interaction.user.id}-${user.id}`)

            Builder.createEmbed()
                .setText(`Кто-то из участников не ответил.`)
                .messageReply(_msg)
        })
        
        c.on("collect", async (i: ButtonInteraction) => {
            c.resetTimer()
            if (i.customId === "cancel-duel") {
                await i.deferUpdate();
                jstEnd = true;
                _duels.delete(`${interaction.user.id}-${user.id}`)
                c.stop()
                Builder.createEmbed()
                    .setText(`${i.user} отменил дуэль.`)
                    .interactionFollowUp(i)
            } else if (i.customId === "pick-hero") {
                const input = new TextInputBuilder()
                    .setCustomId("hero-name")
                    .setStyle(1)
                    .setLabel("Название героя")
                    .setPlaceholder("Например: Минь")
                    .setRequired(true)

                    const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(input);

                    const modal = new ModalBuilder().setCustomId("hero-pick-modal").setTitle("Выберите героя").addComponents(actionRow);

                    await i.showModal(modal);
                    await i.awaitModalSubmit({time: 30000}).then(async submit => {
                        await submit.deferReply({ephemeral: true})
                        const us = submit.user;
                        const game = await Database.get("Game").findOrCreate(us);
                        const hero = Heroes.find(submit.fields.getTextInputValue("hero-name"));
                        if (!hero) return Builder.createEmbed()
                                .setError(`Герой не найден.`)
                                .editReply(submit);

                        if (!game.heroes[hero.id]) return Builder.createEmbed()
                                .setError(`Вы не имеете этого героя.`)
                                .editReply(submit);

                            const data = _duels.get(`${interaction.user.id}-${user.id}`);
                            data[us.id] = {id: hero.id, mongo: game.heroes[hero.id], nickname: game.nickname, userId: us.id};
                            _duels.set(`${interaction.user.id}-${user.id}`, data);

                            Builder.createEmbed()
                                .setText(`Выбран герой: ${hero}`)
                                .editReply(submit);

                            if (Object.values(_duels.get(`${interaction.user.id}-${user.id}`)).every(v => v)) {
                                jstEnd = true;
                                c.stop();
                                const players = Object.values(_duels.get(`${interaction.user.id}-${user.id}`));
                                const f = players[0];
                                const s = players[1];
                                const fh = Heroes.find(f.id);
                                const sh = Heroes.find(s.id);
                                const fs = Heroes.findSkin(f.id, f.mongo.skin);
                                const ss = Heroes.findSkin(s.id, s.mongo.skin);
                                const att = await FightTemplate.duel(fh.avatarAttachment(f.mongo.skin).attachment as any, sh.avatarAttachment(s.mongo.skin).attachment as any);
                                const msg = await Builder.createEmbed()
                                    .setColor()
                                    .setImage(`attachment://${att.name}`)
                                    .addField(`${f.nickname} ${fh.elements} ${fh} (\`${F.formatNumber(Levels.levelFor(f.mongo.xp))} lvl\`)`, `**${fs.name}**\n${Heroes.attr(fh.id, f.mongo)}`, true)
                                    .addField(`${s.nickname} ${sh.elements} ${sh} (\`${F.formatNumber(Levels.levelFor(s.mongo.xp))} lvl\`)`, `**${ss.name}**\n${Heroes.attr(sh.id, s.mongo)}`, true)
                                    .sendToChannel(interaction.channel, {files: [att]});
                                
                                
                                    const result = Heroes.fight({noSkinBonus: true, anyId: f.userId, id: f.id, attr: Heroes.attr(fh.id, f.mongo), skin: fs.id}, {noSkinBonus: true, anyId: s.userId, id: s.id, attr: Heroes.attr(sh.id, s.mongo), skin: ss.id});
                                    setTimeout(async () => {
                                        const amount = DuelMoney();
                                        const xp = UserXpAfterWin();
                                        if (result.winner.anyId === f.userId) {
                                            Builder.createEmbed()
                                                .setTitle(`Дуэль | Победитель ${f.nickname}`)
                                                .addField(`${f.nickname} ${fh.elements} ${fh} (\`${F.formatNumber(Levels.levelFor(f.mongo.xp))} lvl\`)`, `**${fs.name}**\n${result.winner.attr}`, true)
                                                .addField(`${s.nickname} ${sh.elements} ${sh} (\`${F.formatNumber(Levels.levelFor(s.mongo.xp))} lvl\`)`, `**${ss.name}**\n${result.loser.attr}`, true)
                                                .addField("Награда", F.andOr([`${XpEmoji} ${F.formatNumber(xp)}`, F.toMoneyString(amount, "user", "secondary")]))
                                                .setColor()
                                                .messageReply(msg);
                                            await Promise.all([
                                                Database.addUserXp(f.userId, xp, CustomEvent, interaction.channel),
                                                Database.addHeroXp(f.userId, f.id, HeroXpAfterWin()),
                                                Database.addGame(f.userId, f.id, true, interaction.channel),
                                                Database.addGame(s.userId, s.id, false, interaction.channel),
                                                Database.changeMoney({targetId: f.userId, type: "user", moneyType: "secondary", amount, CustomEvent}),
                                            ])
                                        } else {
                                            Builder.createEmbed()
                                                .setTitle(`Дуэль | Победитель ${s.nickname}`)
                                                .addField(`${f.nickname} ${fh.elements} ${fh} (\`${F.formatNumber(Levels.levelFor(f.mongo.xp))} lvl\`)`, `**${fs.name}**\n${result.loser.attr}`, true)
                                                .addField(`${s.nickname} ${sh.elements} ${sh} (\`${F.formatNumber(Levels.levelFor(s.mongo.xp))} lvl\`)`, `**${ss.name}**\n${result.winner.attr}`, true)
                                                .addField("Награда", F.andOr([`${XpEmoji} ${F.formatNumber(xp)}`, F.toMoneyString(amount, "user", "secondary")]))
                                                .setColor()
                                                .messageReply(msg);
                                            await Promise.all([
                                                Database.addUserXp(s.userId, xp, CustomEvent, interaction.channel),
                                                Database.addHeroXp(s.userId, s.id, HeroXpAfterWin()),
                                                Database.addGame(f.userId, f.id, false, interaction.channel),
                                                Database.addGame(s.userId, s.id, true, interaction.channel),
                                                Database.changeMoney({targetId: s.userId, type: "user", moneyType: "secondary", amount, CustomEvent}),
                                            ])
                                        }
                                        _duels.delete(`${interaction.user.id}-${user.id}`)
                                    }, 10 * 1000)
                            }
                    })
                    
            }
        })

        



    }
})