import { RaritySkinCost } from "../../docs/CommandSettings";
import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Manor',
    attr: new HeroAttribute({hp: 13500, dmg: 130, dxt: 27}),
    description: "Добро Пожаловать!\n\nПутешествие во времени открыто благодаря Манор.",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Manor:1009524699606302720>",
    isEventHero: false,
    cost: new Cost("secondary", 27000, new Cost("secondary", 24999)),
    elements: new HeroElement("magic", "fire"),
    skins: [
        {   
            id: "sila-vremeni",
            name: "Сила Времени",
            bonus: {hp: 500, dxt: 5},
            cost: new Cost('primary', RaritySkinCost.elite),
            rarity: "elite"
        },
        {
            id: "guest-proshlogo",
            name: "Гость из Прошлого",
            bonus: {hp: 850, dmg: 30},
            cost: new Cost("primary", RaritySkinCost.special),
            rarity: "special"
        },
        {
            id: "bezjalostnaya-magia",
            name: "Безжалостная Магия",
            bonus: {dmg: 70, hp: 600},
            cost: new Cost("primary", RaritySkinCost.epic),
            rarity: "epic"
        },
        {
            id: "blood-of-demon",
            name: "Кровь Демона",
            bonus: {dmg: 90, dxt: 20, hp: 1000},
            rarity: "legendary",
            cost: new Cost("primary", RaritySkinCost.legendary)
        }
    ],
})