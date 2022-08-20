import { RaritySkinCost } from "../../docs/CommandSettings";
import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: "Argon",
    attr: new HeroAttribute({hp: 19800, dmg: 188, dxt: 41}),
    description: "Да здравствует Мрак!\n\nСледующая цель Аргона - Земля!",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Argon:1010512645679501373>",
    isEventHero: false,
    cost: new Cost("secondary", 66000, new Cost("secondary", 62999)),
    elements: new HeroElement("darkness", "water", "blood"),
    skins: [
        {
            id: "supernatural",
            name: "Сверхъестественный",
            bonus: {hp: 870, dmg: 85},
            rarity: 'epic',
            cost: new Cost('primary', RaritySkinCost.epic)
        }
    ]
})