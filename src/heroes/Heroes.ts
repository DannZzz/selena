import { Util } from "client-discord";
import { AttachmentBuilder, Collection } from "discord.js";
import { WebName } from "../config";
import { Levels } from "../custom-modules/Level-xp";
import { MongoHero } from "../database/models/Game";
import { DxtDoubleAttackChance } from "../docs/CommandSettings";
import { CurrencyType, UserCurrency } from "../structures/Currency";
import { Functions } from "../structures/Functions";
import { Cost, ObjectType } from "../structures/MainTypes";
import { HeroCollections } from "./Collections";
import { HeroNames } from "./hero-names";
import { Fighter, HeroAttribute, HeroElement, HeroElementsContrs, HeroElementsNames, HeroId, HeroList, HeroRarityColor, HeroResolvable, HeroSkinRarity, SkinBonus } from "./heroes-attr";

export const _heroCollection = new Collection<HeroId, Hero>();

export class Heroes {
    static readonly data = _heroCollection;
    static attr (id: HeroId | string, data: MongoHero) {
        const _data = {...data.attr};
        const heroLevel = Levels.levelFor(data.xp);
        const hero = this.find(id);
        for(let k in _data) {
            if (hero.attr[k]) _data[k] += hero.attr[k] / 10 * (heroLevel - 1);
        }
        const skinData = this.findSkin(id as any, data.skin);
        return new HeroAttribute(_data, skinData?.bonus, hero.attr);
    }
    static attrFrom(attr: HeroAttribute) {
        return new HeroAttribute(attr);
    }

    static clone (hero: HeroResolvable) {
        const h = Functions.resolveHero(hero)[0]
        return new Hero({...h});
    }

    static filter (fn: (hero: Hero) => boolean) {
        return new HeroList(...this.data.filter(fn).values());
    }

    static get collections () {
        return HeroCollections;
    }

    static find<N extends HeroId>(id: N): Hero;
    static find(name: string): Hero;
    static find<N extends HeroId>(id: N | string) {
        if (this.data.has(id as any)) return this.data.get(id as any)?.clone();
        for (let _id in HeroNames) {
            if (HeroNames[_id].toLowerCase() === id.toLowerCase()) {
                return this.data.get(_id as any)?.clone() || null;
            } else continue;
        }
        return null;
    }

    static findSkin(heroId: HeroId | string, skin: string): HeroSkin {
        const hero = this.find(heroId);
        if (!skin || !hero) return null
        if (heroId.toLowerCase() === skin.toLowerCase()) return {
            bonus: {},
            cost: new Cost(),
            id: hero.id,
            rarity: "common",
            name: `${hero}`
        }
        return hero.skins.find(s => s.id.toLowerCase() === skin.toLowerCase()) || null
    }

    static sort (): (typeof Heroes)['data'] {
        let collection = new Collection();
        for (let i in HeroNames) {
            const hd = Heroes.find(i);
            hd && collection.set(i, hd);
        }
        return collection as any;
    }

    static getSkinColor (skin: HeroSkin) {
        return skin ? HeroRarityColor[skin.rarity] : HeroRarityColor["common"];
    }

    static fight (f1: Fighter, f2: Fighter) {
        let h1 = this.find(f1.id);
        let h2 = this.find(f2.id);

        if (!f1.noSkinBonus) f1.attr.add(this.findSkin(f1.id, f1.skin)?.bonus);
        if (!f2.noSkinBonus) f2.attr.add(this.findSkin(f2.id, f2.skin)?.bonus);
        const els = this.elementBuffLevel(h1.elements, h2.elements);
        f1.attr.dmg *= els.p1;
        f2.attr.dmg *= els.p2;
        if (f1.attr?.dxt >= f2.attr?.dxt) {
            while (true) {
                f2.attr.hp -= f1.attr.dmg * (Util.random(1, 100) <= DxtDoubleAttackChance ? 2 : 1);
                if (f2.attr.hp <= 0) break;
                f1.attr.hp -= f2.attr.dmg;
                if (f1.attr.hp <= 0) break;
            }
        } else {
            while (true) {
                f1.attr.hp -= f2.attr.dmg * (Util.random(1, 100) <= DxtDoubleAttackChance ? 2 : 1);
                if (f1.attr.hp <= 0) break;
                f2.attr.hp -= f1.attr.dmg;
                if (f2.attr.hp <= 0) break;
            }
        }

        if (f1.attr.hp <= 0) {
            f1.attr.hp = 0;
            return {
                winner: f2,
                loser: f1
            }
        };
        if (f2.attr.hp <= 0) {
            f2.attr.hp = 0;
            return {
                winner: f1,
                loser: f2
            }
        };

    }

    static elementBuffLevel (p1: HeroElement, p2: HeroElement) {
        let f = 0;
        function check (el: keyof typeof HeroElementsNames, els: HeroElement) {
            if (HeroElementsContrs[el].some(contr => els.elements.includes(contr))) return 1;
            if (els.elements.includes(el)) return -1;
            return 0;
        }

        p1.elements.forEach(el => {
            f += check(el, p2);
        })

        p2.elements.forEach(el => {
            f -= check(el, p1);
        })

        if (f === 0) {
            return {
                p1: 1,
                p2: 1
            }
        } else if (f > 0) {
            return {
                p1: 2,
                p2: 1
            }
        } else if (f < 0) {
            return {
                p1: 1,
                p2: 2
            }
        }
    }
}

export class Hero {
    id: HeroId
    description: string
    attr: HeroAttribute
    skins: HeroSkin[]
    isVip: boolean
    emoji: string
    isAvailableInShop: boolean
    isEventHero: boolean
    cost: Cost
    elements: HeroElement

    get name () {
        return `${HeroNames[this.id]}`;
    }
    
    toString() {
        return HeroNames[this.id];
    }

    avatarURL(skin?: string) {
        return `${WebName}/api/hero/avatar/${this.id}/${skin || this.id}.jpg`
    }

    avatarAttachment(skin?: string) {
        return new AttachmentBuilder(`./hero-images/${this.id}/${skin || this.id}.jpg`, {name: `${this.id}-${skin || this.id}.jpg`})
    }

    emojied () {
        return `${this.emoji} ${this}`;
    }

    clone() {
        return new Hero({...this, attr: Heroes.attrFrom(this.attr)});
    }

    constructor (private data: Omit<Hero, "toString" | "avatarURL" | "avatarAttachment" | "emojied" | "name" | "clone">) {
        Object.assign(this, data);
    }
}

export interface HeroSkin {
    name: string
    bonus: SkinBonus
    rarity: HeroSkinRarity
    cost: Cost
    id: string
    availableUntil?: Date
}