import { RaritySkinCost } from "../../docs/CommandSettings";
import { LimitedSkinsBuff, SkinLimits } from "../../docs/limits";
import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Elena',
    attr: new HeroAttribute({hp: 8700, dmg: 140, dxt: 15}),
    description: "Говорят на севере обитает девушка, которая общается с зимой, холодом, морозом и снегом.\n\nКто же это?",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Elena:1010907819383463966>",
    isEventHero: false,
    cost: new Cost("secondary", 17800),
    elements: new HeroElement("snow", "rainbow"),
    skins: [
        {
            id: "moon-vspishka",
            name: "Лунная Вспышка",
            bonus: LimitedSkinsBuff.moon,
            rarity: "moon",
            cost: new Cost("primary", RaritySkinCost.moon),
            availableUntil: SkinLimits.moon
        }
    ],
})