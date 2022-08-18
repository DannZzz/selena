import { stripIndents } from "common-tags";
import { Badge } from "../../custom-modules/Badge";
import { Levels } from "../../custom-modules/Level-xp";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "top",
    category: "Game",
    autocomplete: "hero",
    data: new SlashBuilder()
        .setName("top")
        .setDescription("Посмотреть списки лидеров")
        .addSubcommand(s => s
            .setName("xp")
            .setDescription("Топ по xp"))
        .addSubcommand(s => s
            .setName("wins")
            .setDescription("Топ по количеству побед"))
        .addSubcommand(s => s
                .setName("games")
                .setDescription("Топ по количеству игр"))
        .addSubcommand(s => s
            .setName("hero")
            .setDescription("Топ по выигранных боёв за героя")
            .addStringOption(o => o
                .setName("hero")
                .setDescription("Герой")
                .setRequired(true)
                .setAutocomplete(true)))
    ,
    async execute ({interaction, client, Builder, Database, options, F, Heroes}) {
        const cmd = options.getSubcommand();
        await interaction.deferReply()
        if (cmd === "xp") {
            const data = await Database.get("Game").findMany({xp: {$gte: 0}});
            const sorted = data.sort((a, b) => b.xp - a.xp).slice(0, 10);

            Builder.createEmbed()
                .setTitle("Топ по XP")
                .setThumbnail(F.resolveEmojiToLink(Badge.emojis.mostxp).link)
                .setText(stripIndents`**Топ 1 — ${Badge.emojis.mostxp}**\n\n${sorted.map((d, i) => `${i+1}. **${Badge.rankFor(Levels.levelFor(d.xp)) ? Badge.rankFor(Levels.levelFor(d.xp)) + " " : ""}${d.nickname}** — **${F.levelFormat(d.xp)}**`).join("\n\n") || "Пока что пусто.."}`)
                .editReply(interaction)
        } else if (cmd === "wins") {
            const data = await Database.get("Game").findMany({wins: {$gte: 0}});
            const sorted = data.sort((a, b) => {
                const br = F.resolveGames(b.heroes);
                const ar = F.resolveGames(a.heroes);
                return br.wins - ar.wins;
            }).slice(0, 10);

            Builder.createEmbed()
                .setTitle("Топ по количеству побед")
                .setThumbnail(F.resolveEmojiToLink(Badge.emojis.mostwins).link)
                .setText(stripIndents`**Топ 1 — ${Badge.emojis.mostwins}**\n\n${sorted.map((d, i) => {
                    const r = F.resolveGames(d.heroes);
                    return `${i+1}. **${Badge.rankFor(Levels.levelFor(d.xp)) ? Badge.rankFor(Levels.levelFor(d.xp)) + " " : ""}${d.nickname}** — **${F.formatNumber(r.games || 0)}** игр | **${F.formatNumber(r.wins || 0)}** (${F.wr(r.games, r.wins)}) побед`
                }).join("\n\n") || "Пока что пусто.."}`)
                .editReply(interaction)
        } else if (cmd === "games") {
            const data = await Database.get("Game").findMany({wins: {$gte: 0}});
            const sorted = data.sort((a, b) => {
                const br = F.resolveGames(b.heroes);
                const ar = F.resolveGames(a.heroes);
                return br.games - ar.games;
            }).slice(0, 10);

            Builder.createEmbed()
                .setTitle("Топ по количеству игр")
                .setThumbnail(F.resolveEmojiToLink(Badge.emojis.mostgames).link)
                .setText(stripIndents`**Топ 1 — ${Badge.emojis.mostgames}**\n\n${sorted.map((d, i) => {
                    const r = F.resolveGames(d.heroes);
                    return `${i+1}. **${Badge.rankFor(Levels.levelFor(d.xp)) ? Badge.rankFor(Levels.levelFor(d.xp)) + " " : ""}${d.nickname}** — **${F.formatNumber(r.games || 0)}** игр | **${F.formatNumber(r.wins || 0)}** (${F.wr(r.games, r.wins)}) побед`
                }).join("\n\n") || "Пока что пусто.."}`)
                .editReply(interaction)
        } else if (cmd === "hero") {
            const heroName = options.getString("hero");
            const hd = Heroes.find(heroName);
            if (!hd) return Builder.createError("Герой не найден.", interaction.user).editReply(interaction);
            const data = await Database.get("Game").findMany({heroes: {$nin: [{}]}});
            const hasHero = data.filter(d => Object.keys(d.heroes).some(hk => hk === hd.id));
            const sorted = hasHero.sort((a, b) => {
                return b.heroes?.[hd.id]?.wins - a.heroes?.[hd.id]?.wins;
            }).slice(0, 10);
            const att = hd.avatarAttachment(sorted?.[0]?.heroes?.[hd.id]?.skin || hd.id);
            Builder.createEmbed()
                .setTitle("Топ по количеству побед за героя " + hd)
                .setThumbnail(`attachment://${att.name}`)
                .setText(stripIndents`${sorted.map((d, i) => `${i+1}. **${Badge.rankFor(Levels.levelFor(d.xp)) ? Badge.rankFor(Levels.levelFor(d.xp)) + " " : ""}${d.nickname}** — **${F.formatNumber(d.heroes?.[hd.id]?.games || 0)}** игр | **${F.formatNumber(d.heroes?.[hd.id]?.wins || 0)}** (${F.wr(d.heroes?.[hd.id]?.games, d.heroes?.[hd.id]?.wins)}) побед`).join("\n\n") || "Пока что пусто.."}`)
                .editReply(interaction, {files: [att]})
        }
    }
    
})