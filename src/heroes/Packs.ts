import { Collection, EmojiResolvable } from "discord.js";
import { User } from "../database/models/User";
import { RandomMoney } from "../structures/Currency";
import { ObjectType } from "../structures/MainTypes";
import { HeroList, HeroResolvable } from "./heroes-attr";
export const _packCollection = new Collection<PackId, Pack>()

export enum PackNames {
    startpack = "Пак начальных героев",
    small_chest = "Маленький сундук сокровищ",
    big_chest = "Большой сундук сокровищ",
    love_pack = "Пак Любви",
    moon_pack = "Лунный Пак",
}

export type PackId = keyof typeof PackNames;

export interface PackRewards {
    "hero-pick": HeroList
    "hero": HeroResolvable
    "money": RandomMoney[]
    "skin-pick": {hero: HeroResolvable, skinId: string}[]
}

export class Pack<T extends keyof PackRewards = any>{
    id: PackId;
    type: T;
    emoji: EmojiResolvable;
    availableUntil?: Date
    reward: () => PackRewards[T];

    get name () {
        return `${PackNames[this.id]}`;
    }
    
    toString () {
        return `${this.emoji} ${PackNames[this.id]}`;
    }

    constructor(data: Omit<Pack<T>, "toString" | "name">) {
        Object.assign(this, data)
    }

}

export class Packs {
    static data = _packCollection;

    static find<N extends PackId>(id: N): Pack<Pack['type']>;
    static find(name: string): Pack;
    static find<N extends PackId>(id: N | string) {
        if (this.data.has(id as N)) return this.data.get(id as any);
        for (let _id in PackNames) {
            if (PackNames[_id].toLowerCase() === id.toLowerCase()) {
                return this.data.get(_id as any) || null;
            } else continue;
        }
        return null;
    }

    static resolveUserPacks(packs: User['packs']): Partial<ObjectType<keyof User['packs'], [number, Pack]>> {
        const a = {};
        for (let i in packs) {
            const pack = this.find(i);
            if (!pack || !packs[i] || 0 > packs[i]) continue;
            a[i] = [packs[i], pack];
        }
        return a;
    }
}
