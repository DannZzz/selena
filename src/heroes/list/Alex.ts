import { RaritySkinCost } from "../../docs/CommandSettings";
import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: "Alex",
    attr: new HeroAttribute({hp: 5250, dmg: 95, dxt: 13}),
    description: "Самый обычный работяга устал от жизни, почему бы ему не отвлечься и не изучать тёмные стороны Земли?",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Alex:1008050497808248894>",
    isEventHero: false,
    cost: new Cost("secondary", 9000, new Cost("secondary", 7999)),
    elements: new HeroElement("wind"),
    skins: [
        {   
            id: "night-biker",
            name: "Ночной Байкер",
            bonus: {dmg: 60},
            cost: new Cost('primary', RaritySkinCost.elite),
            rarity: "elite"
        },
        {
            id: "koshmar",
            name: "Кошмар",
            bonus: {dmg: 50, hp: 400},
            cost: new Cost('primary', RaritySkinCost.special),
            rarity: "special"
        }
    ],
})