import Database from "../database/db";
import { Functions } from "./Functions";
import { Cost, ObjectType } from "./MainTypes";
import { CustomEvent } from "./CustomEvent";

class Money {
    constructor (readonly emoji: string) {
    }

    toString() {
        return this.emoji;
    }
}

export type CurrencyType = typeof Currency['types'];

export type UserCurrency = typeof Currency.types.user;
export type GuildCurrency = typeof Currency.types.guild;

export type MoneyObject = ObjectType<keyof typeof Currency['types']['user'], number>;

export class Currency {
    static list (type: keyof (typeof Currency)['types']) {
        return Object.values(this.types[type]);
    }
    
    static types: {
        guild: {
            secondary: Money
        }
        user: {
            secondary: Money
            primary: Money
        }
    } = {
        guild: {
            secondary: new Money("<:serveressence:1002514999115272194>")
        },
        user: {
            secondary: new Money("<:useressence:1002515001044643901>"),
            primary: new Money("<:crystal:1008321514090799204>")
        }
    }

    static from(...moneyz: (RandomMoney | Cost)[]) {
        return new CurrencyMixed(...moneyz)
    }

}

class CurrencyMixed implements MoneyObject {
    secondary: number;
    primary: number;
    readonly moneyString: string[] = []

    constructor (...moneyz: (RandomMoney | Cost)[]) {
        const money: MoneyObject = {
            secondary: 0,
            primary: 0
        }
        moneyz.forEach(m => {
            if (Array.isArray(m)) {
                m.forEach(mm => {
                    if (!mm || !mm.type) return;
                if (mm instanceof RandomMoney) {
                    mm.fixedAmount();
                    money[mm.type] += mm.amount || 0;
                } else money[mm.type] += mm.amount || 0;
                })
                return;
            }
            if (!m || !m.type) return;
            if (m instanceof RandomMoney) {
                m.fixedAmount();
                money[m.type] += m.amount || 0;
            } else money[m.type] += m.amount || 0;
        })

        for (let i in money) {
            if (money[i] > 0) {
                this.moneyString.push(Functions.toMoneyString(Math.round(money[i]), "user", i as any));
                this[i] = Math.round(money[i] || null)
            }
        }
    }

    async updateBase (userId: string, CustomEvent: CustomEvent) {
        const promises = []
        for (let i of ["primary", "secondary"] as (keyof MoneyObject)[]) {
            if (this[i]) promises.push(Database.changeMoney({targetId: userId, amount: this[i], type: "user", moneyType: i as any, CustomEvent}))
        }
        await Promise.all(promises);
    }
    toString () {
        return Functions.andOr(this.moneyString)
    }

}

export class RandomMoney {
    private _amount: number;
    private _type?: keyof UserCurrency
    getAmount?: () => number

    toString () {
        return this._type && (this._amount || this._amount === 0) ? Functions.toMoneyString(this._amount, "user", this._type) : "Недоступно"
    }

    get type () {
        return this._type;
    }

    fixedAmount() {
        this._amount = this.getAmount()
        return this;
    }

    get amount () {
        return this._amount || this.fixedAmount?.()?._amount || 0;
    }

    constructor ();
    constructor (type: keyof UserCurrency, getAmount: () => number)
    constructor (type?: keyof UserCurrency, getAmount?: () => number) {
        if (type) this._type = type;
        if (getAmount?.()) this.getAmount = getAmount;
    }
}