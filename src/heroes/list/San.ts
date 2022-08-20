import { RaritySkinCost } from "../../docs/CommandSettings";
import { Cost } from "../../structures/MainTypes";
import { Hero } from "../Heroes";
import { HeroAttribute, HeroElement } from "../heroes-attr";

export default new Hero ({
    id: "San",
    attr: new HeroAttribute({hp: 7200, dmg: 55, dxt: 14}),
    description: "- Ты что, увидел радугу?\n\n- Нет, я увидел Сан!",
    isAvailableInShop: true,
    isVip: false,
    emoji: "<:San:1010512549298573332>",
    isEventHero: false,
    cost: new Cost("secondary", 11000, new Cost("secondary", 8999)),
    elements: new HeroElement("rainbow", "snow"),
    skins: []
})