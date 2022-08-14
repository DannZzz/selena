import { Util } from "client-discord";
import { RandomMoney } from "../../structures/Currency";
import { Pack } from "../Packs";

export default new Pack({
    type: "money",
    reward: () => [new RandomMoney("secondary", () => Util.random(250, 1050)), new RandomMoney("primary", () => Util.random(10, 25))],
    id: "big_chest",
    emoji: "<:big_chest:1008321846418100244>",
})