import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: "Lucius",
    attr: new HeroAttribute({hp: 4250, dmg: 44, dxt: 9}),
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
            bonus: {hp: 200, dmg: 10},
            cost: new Cost('primary', 150),
            rarity: "elite"
        },
        {
            id: "caesar",
            name: "Цезарь",
            bonus: {dmg: 30, hp: 300},
            cost: new Cost("primary", 1059),
            rarity: "special"
        },
        {
            id: "magic-change",
            name: "Магическое Превращение",
            bonus: {hp: 600},
            cost: new Cost("primary", 799),
            rarity: "epic"
        },
    ]
})