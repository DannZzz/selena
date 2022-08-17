import { RaritySkinCost } from "../../docs/CommandSettings";
import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Ming',
    attr: new HeroAttribute({hp: 4100, dmg: 85, dxt: 15}),
    description: "Что получится если с 3-х лет взять в руки катану и изучать боевые исскуства?\nМинь вам ответит.",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Ming:1005129946135527464>",
    isEventHero: false,
    cost: new Cost("secondary", 5000),
    skins: [
        {   
            id: "son-of-grom",
            name: "Сын Грома",
            bonus: {dxt: 10, hp: 800},
            cost: new Cost('primary', RaritySkinCost.special),
            rarity: "special"
        },
        {
            id: "mythical-samurai",
            name: "Мистический Самурай",
            bonus: {dmg: 75, hp: 500},
            cost: new Cost("primary", RaritySkinCost.epic),
            rarity: "epic"
        }
    ],
    elements: new HeroElement("blood")
})