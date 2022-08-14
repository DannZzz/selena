import Database from "../database/db";
import { Currency, RandomMoney, UserCurrency } from "../structures/Currency";
import { CustomEvent } from "../structures/CustomEvent";
import { Functions } from "../structures/Functions";
import { ObjectType } from "../structures/MainTypes";
import { Heroes } from "./Heroes";
import { HeroAttribute, HeroId } from "./heroes-attr";
import { Pack, PackId, Packs } from "./Packs";


export class AdventureEnemy {
    id: HeroId;
    attr: HeroAttribute
    boss: boolean
    reward: RandomMoney[]
    packs?: {packId: PackId, amount: number}[] = []

    toString() {
        return `${Heroes.find(this.id)}`
    }

    clone () {
        return new AdventureEnemy({...this, attr: new HeroAttribute({...this.attr})})
    }

    async giveReward (userId: string, CustomEvent: CustomEvent) {
        const reward = Currency.from(...this.reward);
        const promises = [reward.updateBase(userId, CustomEvent)] as any[];
        this.packs.forEach(p => promises.push(Database.updatePack(userId, p.packId, p.amount)));
        await Promise.all(promises)
    }

    get rewardString () {
        const moneys = Currency.from(...this.reward).moneyString;
        const packs = this.packs.map(p => {return {pack: Packs.find(p.packId), amount: p.amount}}).map(p => `${p.pack.emoji} ${Functions.formatNumber(p.amount)}`);
        return Functions.andOr([...moneys, ...packs])
    }

    constructor(data: Omit<AdventureEnemy, "toString" | "rewardString" | "giveReward" | "clone">) {
        Object.assign(this, data);
    }
}

export default function AdventureLevels (): ObjectType<number, AdventureEnemy> {
    return {
        1: new AdventureEnemy({id: "Kaja", attr: new HeroAttribute({hp: 3500, dmg: 25, dxt: 4}), boss: false, reward: [new RandomMoney("secondary", () => 350)]}),
        2: new AdventureEnemy({id: "Kaja", attr: new HeroAttribute({hp: 3900, dmg: 30, dxt: 7}), boss: false, reward: [new RandomMoney("secondary", () => 250)]}),
        3: new AdventureEnemy({id: "Ming", attr: new HeroAttribute({hp: 3000, dmg: 65, dxt: 12}), boss: false, reward: [new RandomMoney("secondary", () => 450)]}),
        4: new AdventureEnemy({id: "Kaja", attr: new HeroAttribute({hp: 4200, dmg: 45, dxt: 11}), boss: false, reward: [new RandomMoney("secondary", () => 600)]}),
        5: new AdventureEnemy({id: "Afina", attr: new HeroAttribute({hp: 3500, dmg: 135, dxt: 9}), boss: true, packs: [{packId: "small_chest", amount: 1}], reward: [new RandomMoney("secondary", () => 1000), new RandomMoney("primary", () => 5)]}),
        6: new AdventureEnemy({id: "Ming", attr: new HeroAttribute({hp: 4500, dmg: 90, dxt: 15}), boss: false, reward: [new RandomMoney("secondary", () => 750)]}),
        7: new AdventureEnemy({id: "Kaja", attr: new HeroAttribute({hp: 5200, dmg: 85, dxt: 13}), boss: false, reward: [new RandomMoney("secondary", () => 900)]}),
        8: new AdventureEnemy({id: "Kaja", attr: new HeroAttribute({hp: 5800, dmg: 95, dxt: 17}), boss: false, reward: [new RandomMoney("secondary", () => 1100)]}),
        9: new AdventureEnemy({id: "Afina", attr: new HeroAttribute({hp: 4200, dmg: 150, dxt: 13}), boss: false, reward: [new RandomMoney("secondary", () => 1400)]}),
        10: new AdventureEnemy({id: "Bella_And_Sam", attr: new HeroAttribute({hp: 8350, dmg: 98, dxt: 19}), boss: true, packs: [{packId: "small_chest", amount: 2}], reward: [new RandomMoney("secondary", () => 2000), new RandomMoney("primary", () => 15)]}),
        11: new AdventureEnemy({id: "Malxaz", attr: new HeroAttribute({hp: 8750, dmg: 110, dxt: 2}), boss: false, reward: [new RandomMoney("secondary", () => 1600)]}),
        12: new AdventureEnemy({id: "Atilla", attr: new HeroAttribute({hp: 7600, dmg: 180, dxt: 15}), boss: false, reward: [new RandomMoney("secondary", () => 1850)]}),
        13: new AdventureEnemy({id: "Bella_And_Sam", attr: new HeroAttribute({hp: 9050, dmg: 128, dxt: 25}), boss: false, reward: [new RandomMoney("secondary", () => 2050)]}),
        14: new AdventureEnemy({id: "Kaja", attr: new HeroAttribute({hp: 8550, dmg: 100, dxt: 20}), boss: false, reward: [new RandomMoney("secondary", () => 2200)]}),
        15: new AdventureEnemy({id: "Ming", attr: new HeroAttribute({hp: 10060, dmg: 220, dxt: 29}), boss: true, packs: [{packId: "small_chest", amount: 3}], reward: [new RandomMoney("secondary", () => 3000), new RandomMoney("primary", () => 20)]}),
        16: new AdventureEnemy({id: "Afina", attr: new HeroAttribute({hp: 8050, dmg: 420, dxt: 12}), boss: false, reward: [new RandomMoney("secondary", () => 2500)]}),
        17: new AdventureEnemy({id: "Bella_And_Sam", attr: new HeroAttribute({hp: 12250, dmg: 200, dxt: 30}), boss: false, reward: [new RandomMoney("secondary", () => 2700)]}),
        18: new AdventureEnemy({id: "Malxaz", attr: new HeroAttribute({hp: 11750, dmg: 159, dxt: 9}), boss: false, reward: [new RandomMoney("secondary", () => 3000)]}),
        19: new AdventureEnemy({id: "Ming", attr: new HeroAttribute({hp: 13950, dmg: 300, dxt: 28}), boss: false, reward: [new RandomMoney("secondary", () => 3500)]}),
        20: new AdventureEnemy({id: "Atilla", attr: new HeroAttribute({hp: 15050, dmg: 450, dxt: 46}), boss: true, packs: [{packId: "big_chest", amount: 1}], reward: [new RandomMoney("secondary", () => 5000), new RandomMoney("primary", () => 30)]}),
        21: new AdventureEnemy({id: "Alex", attr: new HeroAttribute({hp: 13000, dmg: 350, dxt: 25}), boss: false, reward: [new RandomMoney("secondary", () => 4500)]}),
        22: new AdventureEnemy({id: "Misoko", attr: new HeroAttribute({hp: 16050, dmg: 440, dxt: 32}), boss: false, reward: [new RandomMoney("secondary", () => 4900)]}),
        23: new AdventureEnemy({id: "Rocky", attr: new HeroAttribute({hp: 23050, dmg: 210, dxt: 37}), boss: false, reward: [new RandomMoney("secondary", () => 5600)]}),
        24: new AdventureEnemy({id: "Ming", attr: new HeroAttribute({hp: 17600, dmg: 475, dxt: 40}), boss: false, reward: [new RandomMoney("secondary", () => 6000)]}),
        25: new AdventureEnemy({id: "Diana", attr: new HeroAttribute({hp: 24050, dmg: 750, dxt: 51}), boss: true, packs: [{packId: "small_chest", amount: 3}, {packId: "big_chest", amount: 2}], reward: [new RandomMoney("secondary", () => 7000), new RandomMoney("primary", () => 35)]}),
        26: new AdventureEnemy({id: "Atilla", attr: new HeroAttribute({hp: 19050, dmg: 550, dxt: 47}), boss: false, reward: [new RandomMoney("secondary", () => 6500)]}),
        27: new AdventureEnemy({id: "Malxaz", attr: new HeroAttribute({hp: 21050, dmg: 540, dxt: 11}), boss: false, reward: [new RandomMoney("secondary", () => 6900)]}),
        28: new AdventureEnemy({id: "Bella_And_Sam", attr: new HeroAttribute({hp: 20090, dmg: 500, dxt: 67}), boss: false, reward: [new RandomMoney("secondary", () => 7500)]}),
        29: new AdventureEnemy({id: "Rocky", attr: new HeroAttribute({hp: 28500, dmg: 310, dxt: 46}), boss: false, reward: [new RandomMoney("secondary", () => 8000)]}),
        30: new AdventureEnemy({id: "Diana", attr: new HeroAttribute({hp: 3000, dmg: 1000, dxt: 100}), boss: true, packs: [{packId: "big_chest", amount: 5}], reward: [new RandomMoney("secondary", () => 10000), new RandomMoney("primary", () => 50)]}),
    }
}