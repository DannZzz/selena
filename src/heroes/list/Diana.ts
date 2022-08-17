import { RaritySkinCost } from "../../docs/CommandSettings";
import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Diana',
    attr: new HeroAttribute({hp: 14100, dmg: 165, dxt: 33}),
    description: "Слышали о Посейдоне?\n\nА у него были дети?\n\nПотерянная дочь Посейдона - Диана.",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Diana:1008317367597670432>",
    isEventHero: false,
    cost: new Cost("secondary", 32000, new Cost("secondary", 28999)),
    elements: new HeroElement("water", "water"),
    skins: [
        {   
            id: "poluvoda",
            name: "Полувода",
            bonus: {hp: 1700},
            cost: new Cost('primary', RaritySkinCost.special),
            rarity: "special"
        },
        {
            id: "koroleva-vodi",
            name: "Королева Воды",
            bonus: {dmg: 95},
            cost: new Cost("primary", RaritySkinCost.legendary),
            rarity: "legendary"
        }
    ],
})