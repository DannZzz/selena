import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Amanta',
    attr: new HeroAttribute({hp: 7250, dmg: 105, dxt: 10}),
    description: "Аманта, маг из средневековье. Мало что о ней известно, говорят, она лечила раненные душы.",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Amanta:1007365718498627664>",
    isEventHero: false,
    cost: new Cost("secondary", 15000),
    skins: [
        {   
            id: "izbranica-mraka",
            name: "Избранница Мрака",
            bonus: {hp: 150, dxt: 4, dmg: 10},
            cost: new Cost('primary', 150),
            rarity: "elite"
        },
        {
            id: "otshelnica",
            name: "Отшельница",
            bonus: {dxt: 10, dmg: 5},
            cost: new Cost("primary", 799),
            rarity: "special"
        },
        {
            id: "chudo-sveta",
            name: "Чудо Света",
            bonus: {dmg: 50, hp: 200},
            rarity: "epic",
            cost: new Cost("primary", 1099)
        },
        {
            id: "golaya-magia",
            name: "Голая Магия",
            bonus: {dmg: 30, dxt: 20, hp: 850},
            rarity: "legendary",
            cost: new Cost("primary", 1599)
        }
    ],
    elements: new HeroElement("magic", "blood")
})