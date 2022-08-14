import { Util } from "client-discord";
import { RandomMoney } from "../../structures/Currency";
import { Pack } from "../Packs";

export default new Pack({
    type: "money",
    reward: () => [new RandomMoney("secondary", () => Util.random(50, 350))],
    id: "small_chest",
    emoji: "<:smallchest:1005897849625657394>",
})