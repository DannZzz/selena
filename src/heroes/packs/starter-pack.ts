import { Heroes } from "../Heroes";
import { Pack } from "../Packs";

export default new Pack ({
    id: "startpack",
    type: "hero-pick",
    emoji: "<:hp:1005468809420881980>",
    reward: () => Heroes.collections.find("startkit")?.heroes
})