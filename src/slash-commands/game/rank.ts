import { stripIndents } from "common-tags";
import { Badge } from "../../custom-modules/Badge";
import { Levels } from "../../custom-modules/Level-xp";
import { ProgressBar } from "../../custom-modules/Progress-bar";
import { MaxLevel, XpEmoji } from "../../docs/CommandSettings";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand({
    id: "rank",
    category: "Game",
    data: new SlashBuilder()
        .setName("rank")
        .setDescription("Ранги и уровни"),
    async execute ({interaction, Builder, F, thisUserGame}) {
        const texted = [];

        for (let i = 1; i <= Badge.maxRankBadge; i++) {
            texted.push(`${Badge.emojis[i]} — ${Badge.badgesByLevel[i]} уровень`);
        }

        const currentRank = Badge.rankFor(Levels.levelFor(thisUserGame.xp));
        const nextRank = Badge.rankFor(Levels.levelFor(thisUserGame.xp), true) !== Badge.maxRankBadge ? Badge.emojis[Badge.rankFor(Levels.levelFor(thisUserGame.xp), true) + 1] : null;

        Builder.createEmbed()
            .setTitle("Никнейм: " + thisUserGame.nickname)
            .setThumbnail(interaction.user.avatarURL())
            .setText(stripIndents`
            **Текущий ранг:** ${currentRank}${Badge.rankFor(Levels.levelFor(thisUserGame.xp), true) === Badge.maxRankBadge ? "" : `\n**Следующий ранг:** ${Badge.emojis[Badge.rankFor(Levels.levelFor(thisUserGame.xp), true) + 1]}`}

            **Уровень:** ${F.levelFormat(thisUserGame.xp)}

            ${F.levelFormat(thisUserGame.xp)} | ${MaxLevel === Levels.levelFor(thisUserGame.xp) ? "Максимальный Уровень" : `${new ProgressBar({total: Levels.xpFor(Levels.levelFor(thisUserGame.xp) + 1), current: thisUserGame.xp, slider: XpEmoji as any, size: 10}).splitBar()} | ${F.levelFormat(Levels.xpFor(Levels.levelFor(thisUserGame.xp) + 1))}`}
            
            **Все доступные ранги**
            ${texted.join("\n")}`)
            .interactionReply(interaction)

        
    }
})