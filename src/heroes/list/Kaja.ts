import { RaritySkinCost } from "../../docs/CommandSettings";
import { SkinLimits } from "../../docs/limits";
import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Kaja',
    attr: new HeroAttribute({hp: 4500, dmg: 75, dxt: 15}),
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
            bonus: {hp: 560},
            cost: new Cost('primary', RaritySkinCost.elite),
            rarity: "elite"
        },
        {
            id: "horus",
            name: "Хорус",
            bonus: {dmg: 100},
            cost: new Cost('primary', RaritySkinCost.egyptian),
            rarity: "egyptian",
            availableUntil: SkinLimits.egyptian
        }
    ],
    elements: new HeroElement("fire", "water")
})