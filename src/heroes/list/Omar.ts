import { RaritySkinCost } from "../../docs/CommandSettings";
import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Omar',
    attr: new HeroAttribute({hp: 7600, dmg: 66, dxt: 8}),
    description: "Жестокий Царь орков готов забрать весь мир!",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Omar:1009212661638123631>",
    isEventHero: false,
    cost: new Cost("secondary", 9000),
    elements: new HeroElement("magic", "fire"),
    skins: [
        {   
            id: "japan-samurai",
            name: "Японский Самурай",
            bonus: {hp: 350, dxt: 2},
            cost: new Cost('primary', RaritySkinCost.elite),
            rarity: "elite"
        },
        {
            id: "captain-okotachi",
            name: "Капитан Окотачи",
            bonus: {dmg: 40, hp: 160},
            cost: new Cost("primary", RaritySkinCost.elite),
            rarity: "epic"
        }
    ],
})