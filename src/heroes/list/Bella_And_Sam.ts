import { RaritySkinCost } from "../../docs/CommandSettings";
import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Bella_And_Sam',
    attr: new HeroAttribute({hp: 7000, dmg: 45, dxt: 8}),
    description: "Девочка по имени Белла потерялась во мраке за горой Анталан. С первого взгляда опасный тигр нашёл её и не трогал, они даже и подружились. Теперь они вместе до этого дня.",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Bella_And_Sam:1005201252155654235>",
    isEventHero: false,
    cost: new Cost("secondary", 6500),
    skins: [
        {   
            id: "charodejka",
            name: "Чародейка",
            bonus: {hp: 300, dxt: 2},
            cost: new Cost('primary', RaritySkinCost.elite),
            rarity: "elite"
        },
        {
            id: "timely-mechta",
            name: "Временная Мечта",
            bonus: {hp: 450, dmg: 35},
            cost: new Cost("primary", RaritySkinCost.special),
            rarity: "special"
        }
    ],
    elements: new HeroElement("water")
})