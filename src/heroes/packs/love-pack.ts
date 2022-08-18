import { Hero, Heroes } from "../Heroes";
import { HeroList } from "../heroes-attr";
import { Pack } from "../Packs";

export default new Pack ({
    id: "love_pack",
    type: "hero-pick",
    emoji: "<:lovepack:1009798256605274152>",
    reward: () => Heroes.collections.find('lovekit')?.heroes
})