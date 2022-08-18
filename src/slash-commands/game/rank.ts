import { stripIndents } from "common-tags";
import { Badge } from "../../custom-modules/Badge";
import { Levels } from "../../custom-modules/Level-xp";
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

        Builder.createEmbed()
            .setTitle("Никнейм: " + thisUserGame.nickname)
            .setThumbnail(interaction.user.avatarURL())
            .setText(stripIndents`
            **Уровень:** ${F.levelFormat(thisUserGame.xp)}
            **Текущий ранг:** ${Badge.rankFor(Levels.levelFor(thisUserGame.xp))}${Badge.rankFor(Levels.levelFor(thisUserGame.xp), true) === Badge.maxRankBadge ? "" : `\n**Следующий ранг:** ${Badge.emojis[Badge.rankFor(Levels.levelFor(thisUserGame.xp), true) + 1]}`}
            
            **Все доступные ранги**
            ${texted.join("\n")}`)
            .interactionReply(interaction)

        
    }
})