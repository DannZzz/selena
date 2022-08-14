import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Ming',
    attr: new HeroAttribute({hp: 3100, dmg: 85, dxt: 15}),
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
            bonus: {dxt: 5, hp: 1500},
            cost: new Cost('primary', 799),
            rarity: "special"
        },
        {
            id: "mythical-samurai",
            name: "Мистический Самурай",
            bonus: {dmg: 55},
            cost: new Cost("primary", 1099),
            rarity: "epic"
        }
    ],
    elements: new HeroElement("blood")
})