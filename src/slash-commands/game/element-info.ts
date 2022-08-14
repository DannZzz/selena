import { Levels } from "../../custom-modules/Level-xp";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { Pagination } from "../../structures/Pagination";
import { stripIndents } from "common-tags";
import { HeroElementsContrs, HeroElementsNames } from "../../heroes/heroes-attr";

export default new SlashCommand ({
    id: "element-info",
    category: "Game",
    data: new SlashBuilder()
        .setName("element-info")
        .setDescription("Открыть информацию о стихиях"),
    async execute ({Heroes, interaction, thisUserGame, Builder, F}) {
        Builder.createEmbed()
            .setText(stripIndents`
            Каждый герой может иметь от 1 до 3 стихий.
            Каждая стихия имеет как слабые, так и сильные стороны.
            Если например ваш герой имеет ${HeroElementsNames.water}, а противник ${HeroElementsNames.fire}, тогда у вас будет 2x атака, и так наоборот.
            А если у вас ${HeroElementsNames.water}, а у противника ${HeroElementsNames.fire} и ${HeroElementsNames.snow}, то атака не будет менятся.

            ${Object.entries(HeroElementsContrs).map(([key, contrs]) => `${HeroElementsNames[key]} --> ${contrs.map(c => HeroElementsNames[c])}`).join("\n")}
            `)
            .setUser(interaction.user)
            .setTitle("Стихия")
            .interactionReply(interaction)
           
    }
})