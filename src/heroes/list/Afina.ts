import { RaritySkinCost } from "../../docs/CommandSettings";
import { LimitedSkinsBuff, SkinLimits } from "../../docs/limits";
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
            bonus: {hp: 300, dxt: 7},
            cost: new Cost('primary', RaritySkinCost.elite),
            rarity: "elite"
        },
        {
            id: "brave-heart",
            name: "Храброе сердце",
            bonus: {hp: 850},
            cost: new Cost("primary", RaritySkinCost.special),
            rarity: "special"
        },
        {
            id: "nebesniy-dojd",
            name: "Небесный Дождь",
            bonus: {dmg: 66, hp: 500},
            cost: new Cost("primary", RaritySkinCost.epic),
            rarity: "epic"
        },
        {
            id: "demonic-son",
            name: "Демонический сон",
            bonus: {dmg: 100, dxt: 15, hp: 1000},
            rarity: "legendary",
            cost: new Cost("primary", RaritySkinCost.legendary)
        },
        {
            id: "suriken-master",
            name: "Сюрикен-Мастер",
            bonus: LimitedSkinsBuff.moon,
            rarity: "moon",
            cost: new Cost("primary", RaritySkinCost.moon),
            availableUntil: SkinLimits.moon
        }
    ],
})