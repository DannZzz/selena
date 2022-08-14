import { Currency } from "../structures/Currency";
import { Functions } from "../structures/Functions";
import AdventureLevels, { AdventureEnemy } from "./Adventure-levels";
import { Packs } from "./Packs";

export class Adventures {
    static levels = AdventureLevels();

    static enemyFor(level: number) {
        const l = this.levels[level];
        if (!l) return null;
        return l.clone();
    }

    static rewardString(level: number) {
        const l = this.levels[level];
        if (!l) return null;
        const a = l.clone();
        
    }
}
