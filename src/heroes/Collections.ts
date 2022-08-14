import { Collection, EmojiResolvable } from "discord.js";
import { Functions } from "../structures/Functions";
import { HeroList, HeroResolvable } from "./heroes-attr";

export const _heroCollection_Collection = new Collection<HeroCollectionId, HeroCollection>()

export enum HeroCollectionNames {
    startkit = "Начальные герои"
}

export type HeroCollectionId = keyof typeof HeroCollectionNames;

export class HeroCollection {
    heroes: HeroList;
    emoji: EmojiResolvable;
    id: HeroCollectionId

    toString () {
        return `${this.emoji} ${HeroCollectionNames[this.id]}`;
    }

    clone () {
        return new HeroCollection ({...this})
    }

    constructor (data: Omit<HeroCollection, "toString" | "clone">) {
        Object.assign(this, data)
    }
}

export class HeroCollections {
    static data = _heroCollection_Collection;

    static find<N extends HeroCollectionId>(id: N): HeroCollection;
    static find(name: string): HeroCollection;
    static find<N extends HeroCollectionId>(id: N | string) {
        if (this.data.has(id as any)) return this.data.get(id as any)?.clone();
        for (let _id in HeroCollectionNames) {
            if (HeroCollectionNames[_id].toLowerCase() === id.toLowerCase()) {
                return this.data.get(_id as any)?.clone() || null;
            } else continue;
        }
        return null;
    }

    static heroCollections (_hero: HeroResolvable) {
        return this.data.filter(cl => cl.heroes.has(_hero))?.map(c => c.clone()) || null;
    }
}