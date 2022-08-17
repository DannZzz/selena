import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: 'Afina',
    attr: new HeroAttribute({hp: 2250, dmg: 115, dxt: 3}),
    description: "Афина, милое лицо и безжалостные руки, убьют любого!",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:Afina:1005139116922511380>",
    isEventHero: false,
    cost: new Cost("secondary", 5000),
    elements: new HeroElement("fire", "blood"),
    skins: [
        {   
            id: "dar-nebes",
            name: "Дар Небес",
            bonus: {hp: 200, dxt: 5},
            cost: new Cost('primary', 150),
            rarity: "elite"
        },
        {
            id: "brave-heart",
            name: "Храброе сердце",
            bonus: {hp: 350},
            cost: new Cost("primary", 799),
            rarity: "special"
        },
        {
            id: "nebesniy-dojd",
            name: "Небесный Дождь",
            bonus: {dmg: 30, hp: 200},
            cost: new Cost("primary", 1059),
            rarity: "epic"
        },
        {
            id: "demonic-son",
            name: "Демонический сон",
            bonus: {dmg: 45, dxt: 9, hp: 500},
            rarity: "legendary",
            cost: new Cost("primary", 1599)
        }
    ],
})