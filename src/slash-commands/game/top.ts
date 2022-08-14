import { stripIndents } from "common-tags";
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
            .setDescription("Топ по побед"))
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
                .setThumbnail(client.user.avatarURL())
                .setText(stripIndents`${sorted.map((d, i) => `${i+1}. **${d.nickname}** — **${F.levelFormat(d.xp)}**`).join("\n\n") || "Пока что пусто.."}`)
                .editReply(interaction)
        } else if (cmd === "wins") {
            const data = await Database.get("Game").findMany({wins: {$gte: 0}});
            const sorted = data.sort((a, b) => b.wins - a.wins).slice(0, 10);

            Builder.createEmbed()
                .setTitle("Топ по количество побед")
                .setThumbnail(client.user.avatarURL())
                .setText(stripIndents`${sorted.map((d, i) => `${i+1}. **${d.nickname}** — **${F.formatNumber(d.wins || 0)}** (${F.wr(d.games, d.wins)}) побед`).join("\n\n") || "Пока что пусто.."}`)
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
                .setTitle("Топ по количество побед за героя " + hd)
                .setThumbnail(`attachment://${att.name}`)
                .setText(stripIndents`${sorted.map((d, i) => `${i+1}. **${d.nickname}** — **${F.formatNumber(d.heroes?.[hd.id]?.wins || 0)}** (${F.wr(d.heroes?.[hd.id]?.games, d.heroes?.[hd.id]?.wins)}) побед`).join("\n\n") || "Пока что пусто.."}`)
                .editReply(interaction, {files: [att]})
        }
    }
    
})