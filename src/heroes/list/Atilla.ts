import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Atilla',
    attr: new HeroAttribute({hp: 7250, dmg: 105, dxt: 10}),
    description: "Атилла - царь гуннов, жестокий монарх.\n- А как он стал царём?\n- Атилла убил своего брата..",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Atilla:1006222992071741600>",
    isEventHero: false,
    cost: new Cost("secondary", 15000, new Cost("secondary", 12999)),
    skins: [
        {   
            id: "mrac-ricar",
            name: "Мрачный Рыцарь",
            bonus: {hp: 300, dxt: 2, dmg: 15},
            cost: new Cost('primary', 150),
            rarity: "elite"
        },
        {
            id: "chingis-xan",
            name: "Чингис Хан",
            bonus: {hp: 600},
            cost: new Cost("primary", 799),
            rarity: "special"
        },
        {
            id: "tevton-orden",
            name: "Тевтонский Орден",
            bonus: {dmg: 25, hp: 500},
            rarity: "epic",
            cost: new Cost("primary", 1099)
        },
        {
            id: "temniy-paladin",
            name: "Тёмный Паладин",
            bonus: {dmg: 45, dxt:7, hp: 1000},
            rarity: "legendary",
            cost: new Cost("primary", 1599)
        }
    ],
    elements: new HeroElement("wind", "magic")
})