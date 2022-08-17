import { RaritySkinCost } from "../../docs/CommandSettings";
import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: "Lucius",
    attr: new HeroAttribute({hp: 4250, dmg: 64, dxt: 9}),
    description: "Позорная казнь или смерть с честью - судьба легионера.",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Lucius:1009433721549627414>",
    isEventHero: false,
    cost: new Cost("secondary", 5000),
    elements: new HeroElement("blood", "wind"),
    skins: [
        {   
            id: "centurion",
            name: "Центурион",
            bonus: {hp: 400, dmg: 30},
            cost: new Cost('primary', RaritySkinCost.elite),
            rarity: "elite"
        },
        {
            id: "caesar",
            name: "Цезарь",
            bonus: {dmg: 45, hp: 630},
            cost: new Cost("primary", RaritySkinCost.special),
            rarity: "special"
        },
        {
            id: "magic-change",
            name: "Магическое Превращение",
            bonus: {hp: 900, dxt: 5},
            cost: new Cost("primary", RaritySkinCost.epic),
            rarity: "epic"
        },
    ]
})