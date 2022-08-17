import { RaritySkinCost } from "../../docs/CommandSettings";
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
            bonus: {hp: 250, dxt: 8, dmg: 20},
            cost: new Cost('primary', RaritySkinCost.elite),
            rarity: "elite"
        },
        {
            id: "otshelnica",
            name: "Отшельница",
            bonus: {dxt: 15, dmg: 70},
            cost: new Cost("primary", RaritySkinCost.special),
            rarity: "special"
        },
        {
            id: "chudo-sveta",
            name: "Чудо Света",
            bonus: {dmg: 55, hp: 500},
            rarity: "epic",
            cost: new Cost("primary", RaritySkinCost.epic)
        },
        {
            id: "golaya-magia",
            name: "Голая Магия",
            bonus: {dmg: 100, dxt: 20, hp: 850},
            rarity: "legendary",
            cost: new Cost("primary", RaritySkinCost.legendary)
        }
    ],
    elements: new HeroElement("magic", "blood")
})