import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Rocky',
    attr: new HeroAttribute({hp: 20000, dmg: 25, dxt: 15}),
    description: "Где-то на севере обрушились камни, и вдруг оживили..\nЭто был Рокки..\nНо ему не понравилось белый снег, и он решил начать новое путешествие!",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Rocky:1007729003878166558>",
    isEventHero: false,
    cost: new Cost("secondary", 15000),
    skins: [
        {   
            id: "dixanie-zimi",
            name: "Дыхание Зимы",
            bonus: {hp: 150, dxt: 3, dmg: 20},
            cost: new Cost('primary', 150),
            rarity: "elite"
        },
        {
            id: "totalizator",
            name: "Тотализатор",
            bonus: {dxt: 20, dmg: 10},
            cost: new Cost("primary", 799),
            rarity: "special"
        },
        {
            id: "izumrud-kamen",
            name: "Изумрудный Камень",
            bonus: {dmg: 45, hp: 300},
            rarity: "epic",
            cost: new Cost("primary", 1099)
        }
    ],
    elements: new HeroElement("snow")
})