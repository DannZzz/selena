import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Malxaz',
    attr: new HeroAttribute({hp: 8500, dmg: 95, dxt: 1}),
    description: "Кто-то говорит, что Малхаз на самом деле человек, а другой, монстр.\n\nНеважно кто он, но он стрёмный.",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Malxaz:1006893417151868968>",
    isEventHero: false,
    cost: new Cost("secondary", 5500),
    skins: [
        {   
            id: "plamen-izobretatel",
            name: "Пламенный Изобретатель",
            bonus: {dxt: 10},
            cost: new Cost('primary', 150),
            rarity: "elite"
        }
    ],
    elements: new HeroElement("snow", "fire")
})