import { RaritySkinCost } from "../../docs/CommandSettings";
import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Kaja',
    attr: new HeroAttribute({hp: 4500, dmg: 50, dxt: 5}),
    description: "Кайя ещё был маленьким ребёнком пока его не украл Грифон. Время с Грифоном изменил Кайю, и вот какой он сейчас.",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Kaja:1005139152167256084>",
    isEventHero: false,
    cost: new Cost("secondary", 5000),
    skins: [
        {   
            id: "fire-dragon",
            name: "Огненный Грифон",
            bonus: {hp: 300},
            cost: new Cost('primary', RaritySkinCost.elite),
            rarity: "elite"
        }
    ],
    elements: new HeroElement("fire", "water")
})