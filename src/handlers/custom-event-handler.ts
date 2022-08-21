import Database from "../database/db";
import { Guild } from "../database/models/Guild";
import { CustomEvent } from "../structures/CustomEvent";
import { PunishmentAction } from "../structures/CustomEventTypes";
import { Functions } from "../structures/Functions";
import { ObjectType } from "../structures/MainTypes";
import { GuildMember } from "discord.js";
import { DiscordComponentBuilder } from "../structures/DiscordComponentBuilder";
import ms from "ms";
import { Durations } from "../docs/SlashOptions";
import { Levels } from "../custom-modules/Level-xp";
import { OnNewLevelAddingAttr } from "../docs/CommandSettings";
import { HeroAttribute, HeroSkinRarityNames } from "../heroes/heroes-attr";
import { Heroes } from "../heroes/Heroes";
import { SkinLimits } from "../docs/limits";
import { Pack, Packs } from "../heroes/Packs";
const F = Functions;

export default function HandleCustomEvents() {
    const Builder = new DiscordComponentBuilder();
    CustomEvent.on("warnCreate", async ({guild, mongoGuild}, punishment, channel) => {
        if (guild) {
            const _mongo = await Database.get("Guild").findOrCreate("_id", guild.id);
            const actions = _mongo.punishmentActions;
            if (!actions || actions.length === 0) return;
            const user_s = Functions.validWarns(_mongo.punishments).filter(p => p.targetId === punishment.targetId);

            const eq = actions.find(pa => pa.amount === user_s.length);
            if (!eq) return;
            const actionToFn: ObjectType<PunishmentAction['type'], string> = {
                ban: "bannable",
                kick: "kickable",
                mute: "moderatable"
            }

            let member: GuildMember;
            try {
                member = await guild.members.fetch(punishment.targetId);
            } catch {
                return Builder.createEmbed().setError("Участник сервера не найден.").sendToChannel(channel);
            }
            if (!member) return Builder.createEmbed().setError("Участник сервера не найден.").sendToChannel(channel);
            if (!member[actionToFn[eq.type]]) return Builder.createEmbed().setError(`Найдено невозможное действие, у меня недостаточно прав.`).sendToChannel(channel);

            if (eq.type === "mute") {
                member.timeout(ms(eq.muteDuration), `Автоматическое Действие. У участника ${user_s.length} предупреждений.`).then(gm => Builder.createEmbed().setText(`**${member.user.username}** получает автоматическое ограничение (${user_s.length} предупреждений).`).addField("⏳ Длительность", `${Durations.find(arr => arr[1] === eq.muteDuration)[0]}`).sendToChannel(channel))
            } else if (eq.type === "kick") {
                member.kick(`Автоматическое Действие. У участника было ${user_s.length} предупреждений.`).then(gm => Builder.createEmbed().setText(`**${member.user.username}** был выгнан из сервера автоматически (${user_s.length} предупреждений).`).sendToChannel(channel))
            } else if (eq.type === "ban") {
                member.ban({reason: `Автоматическое Действие. У участника было ${user_s.length} предупреждений.`}).then(gm => Builder.createEmbed().setText(`**${member.user.username}** был забанен из сервера автоматически (${user_s.length} предупреждений).`).sendToChannel(channel))
            }
        }
    })

    CustomEvent.on("userXpChange", async (thisGuild, oldUser, newUser, channel) => {
        const oldLevel = Levels.levelFor(oldUser.xp);
        const newLevel = Levels.levelFor(newUser.xp);
        if (newLevel !== 1 && oldLevel < newLevel) {
            const ug = await Database.get("Game").findOneFilter({_id: newUser.userId});
            if (!ug) return;
            await Database.get("Game").updateOne({_id: newUser.userId}, {$set: {levelBonusAttr: new HeroAttribute({...OnNewLevelAddingAttr}).add(ug.levelBonusAttr || {})}})
        }
    })

    CustomEvent.on("skinAdd", async (thisGuild, data, channel) => {
        if (!channel) return;
        const skin = Heroes.findSkin(data.heroId, data.skinId);
        if (skin.rarity === "moon") {
            if (!F.isLimited(SkinLimits.moon)) return;
            if (skin.id === "moon-lord") return;
            const user = await Database.get("Game").findOne("_id", data.userId);
            if (!user) return;
            const pack = Packs.find("moon_pack") as Pack<"skin-pick">;
            if (pack.reward().every(hd => {
                const hero = F.resolveHero(hd.hero)[0];
                if (!user.heroes[hero.id]) return false;
                return user.heroes[hero.id].skinsHave.includes(hd.skinId);
            })) {
                if (!user.heroes['Atilla']) await Database.updateHero(data.userId, "Atilla", {type: "add"});
                await Database.updateHero(data.userId, "Atilla", {type: "set-skin", skin: "moon-lord"});
                const hero = Heroes.find("Atilla");
                const attSkin = Heroes.findSkin(hero.id, "moon-lord");
                Builder.createEmbed().setText(`**${user.nickname}** собрал все **${HeroSkinRarityNames.moon}** Облики и получает Облик **${attSkin.name}** на героя **${hero}**.`).sendToChannel(channel);
            }
        }
    })
}