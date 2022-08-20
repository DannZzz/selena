import { ColorResolvable, EmojiResolvable } from "discord.js";
import { UserCurrency } from "../structures/Currency";
import { Functions } from "../structures/Functions";
import { Cost, ObjectType } from "../structures/MainTypes";
import { HeroNames } from "./hero-names";
import { Hero, Heroes, _heroCollection } from "./Heroes";

export type HeroId = keyof typeof HeroNames;

export enum HeroAttributesEnum {
    hp = "♥",
    dmg = "⚔",
    dxt = "⚡",
}

export class HeroAttribute {
    dmg: number
    dxt: number
    hp: number
    constructor (data: ObjectType<keyof typeof HeroAttributesEnum, number>, ...aditional: ObjectType<keyof typeof HeroAttributesEnum, number, true>[]) {
        Object.assign(this, data);
        this.add(...aditional)
    }

    get stringed () {
        const m =  Functions.formatNumber;
        return Object.entries(HeroAttributesEnum).map(([k, emoji]) => `${emoji} ${m(this[k] as any)}`)
    }

    addPercentToEach (percent: number) {
        for (let i in HeroAttributesEnum) {
            this[i] = this[i] ? this[i] + Math.ceil(Functions.percentOf(this[i], percent)) : 0 + Math.ceil(Functions.percentOf(this[i], percent));
        }
        return this;
    }

    setLevel(level: number) {
        for (let k in HeroAttributesEnum) {
            if (this[k]) this[k] += this[k] / 10 * (level - 1);
        }
        return this;
    }
    
    eachTo(number: number) {
        for (let i in HeroAttributesEnum) {
            this[i] = number
        }
        return this;
    }

    add(...aditional: ObjectType<keyof typeof HeroAttributesEnum, number, true>[]) {
        if (aditional) {
            aditional.forEach(d => {
                if (!d) return; 
                for (let i in d) {
                    if (this[i]) {
                        this[i] += d[i] || 0
                    } else {
                        this[i] = d[i] || 0
                    }
                }
            })
        }
        return this;
    }

    toString () {
        const m =  Functions.formatNumber;
        return Object.entries(HeroAttributesEnum).map(([k, emoji]) => `${emoji} ${m(this[k] as any)}`).join("\n");
    }
}

export enum HeroSkinRarityNames {
    common = "Обычный",
    elite = "Элитный",
    special = "Специальный",
    epic = "Эпический",
    legendary = "Легендарный",
    egyptian = "𐌄Ᏽ𐌙𐌐𐌕𐌉𐌀𐌍"
}

export type HeroSkinRarity = keyof typeof HeroSkinRarityNames;

export const HeroRarityColor: ObjectType<HeroSkinRarity, ColorResolvable> = {
    common: "Grey",
    elite: "Green",
    epic: "Purple",
    special: "Blurple",
    legendary: "Yellow",
    egyptian: "Gold"
}

export enum HeroElementsNames {
    fire = "🔥",
    water = "💧",
    blood = "🩸",
    snow = "❄",
    wind = "🌪",
    magic = "🔮",
    rainbow = "🌈",
    light = "🔱",
    darkness = "⚜",
}

export const HeroElementsContrs: ObjectType<keyof typeof HeroElementsNames, (keyof typeof HeroElementsNames)[]> = {
    fire: ['blood'],
    water: ['fire'],
    blood: ['magic'],
    snow: ["water"],
    wind: ["snow"],
    magic: ["light"],
    rainbow: ["wind"],
    darkness: ["rainbow"],
    light: ["darkness"],
}

export type HeroElementKey = keyof typeof HeroElementsNames;

export class HeroElement {
    readonly elements: HeroElementKey[]
    constructor (...elements: HeroElementKey[]) {
        this.elements = elements;
    }

    toString() {
        return this.elements.map(k => HeroElementsNames[k]).join(" ");
    }
}

export type SkinBonus = ObjectType<keyof typeof HeroAttributesEnum, number, true>;

export interface Fighter {
    noSkinBonus?: boolean
    id: HeroId
    attr: HeroAttribute
    anyId: string
    skin: string
}

export class HeroList {
    heroes: Hero[];

    has(hero: HeroResolvable): boolean {
        const heroes = Functions.resolveHero(hero);
        return heroes.every(h => this.heroes.find(hs => hs.id === h.id));
    }

    constructor (...heroes: HeroResolvable[]) {
        let hs = []
        heroes.forEach(h => {
            if (typeof h === "string") {
                hs.push(Heroes.find(h))
            } else if (h instanceof HeroList) {
                h.heroes.forEach(h => hs.push(h))
            } else {
                hs.push(h)
            }
        });
        this.heroes = hs;
    }

    toString(or?: boolean) {
        const named = this.heroes.filter(h => _heroCollection.has(h.id)).map(h => HeroNames[h.id]);
        return Functions.andOr(named, or);
    }
}

export type HeroResolvable = HeroId | HeroList | Hero;