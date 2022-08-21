import { SkinLimits } from "../../docs/limits";
import { Heroes } from "../Heroes";
import { Pack } from "../Packs";

export default new Pack ({
    id: "moon_pack",
    emoji: "<:moonpack:1010949365654896730>",
    type: "skin-pick",
    availableUntil: SkinLimits.moon,
    reward: () => Heroes.filterSkin("moon").heroes.filter(h => Boolean(h.skins.find(s => s.rarity === "moon")?.cost?.type)).map(hd => {
        return {
            hero: hd,
            skinId: hd.skins.find(s => s.rarity === "moon").id
        }
    })
})