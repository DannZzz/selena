import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: "Misoko",
    attr: new HeroAttribute({hp: 9250, dmg: 77, dxt: 9}),
    description: "Аниме - Начало",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Misoko:1008315012923805706>",
    isEventHero: false,
    cost: new Cost("secondary", 12000, new Cost("secondary", 9999)),
    elements: new HeroElement("water", "snow"),
    skins: [
        {   
            id: "heart-of-sea",
            name: "Сердце Моря",
            bonus: {hp: 300},
            cost: new Cost('primary', 1099),
            rarity: "epic"
        }
    ],
})