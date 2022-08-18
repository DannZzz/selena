import { Heroes } from "../Heroes";
import { Pack } from "../Packs";

export default new Pack ({
    id: "startpack",
    type: "hero-pick",
    emoji: "<:lovepack:1009798256605274152>",
    reward: () => Heroes.collections.find("startkit")?.heroes
})