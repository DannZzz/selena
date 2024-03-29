import mongoose from "mongoose";
import { HeroAttribute, HeroId, SkinBonus } from "../../heroes/heroes-attr";
import { ObjectType } from "../../structures/MainTypes";

export interface MongoHero {
    skin: string
    skinsHave: string[]
    xp: number
    games: number
    wins: number
    attr: HeroAttribute
}

export interface Game {
    _id: string
    heroes?: ObjectType<HeroId, MongoHero>
    xp?: number
    adventures?: number
    nickname: string
    levelBonusAttr?: HeroAttribute
} 

export const Game = mongoose.model('game', new mongoose.Schema<Game>({
    _id: String,
    nickname: String,
    heroes: { type: Object, default: {} },
    levelBonusAttr: { type: Object, default: {} },
    xp: { type: Number, default: 0 },
    adventures: { type: Number, default: 0 },
}))

export const GameKeys: readonly (keyof Game)[] = ["_id", "heroes", "xp", "adventures", "nickname", "levelBonusAttr"];
export const GameKeysApi: readonly (keyof Game)[] = ["_id", "heroes", "xp", "adventures", "nickname"];