import { GuildChannel, PrivateThreadChannel, PublicThreadChannel, TextChannel, NewsChannel, User, Guild } from "discord.js";
import { UserCurrency } from "./Currency";
import { Functions } from "./Functions";

export type ObjectType<K extends keyof any = string, V = any, A = false> = A extends true ? {[k in K]?: V} : {[k in K]: V};

export type TextCommandChannel = GuildChannel | PrivateThreadChannel | PublicThreadChannel | TextChannel | NewsChannel;

export type DiscordUser = User;

export type DiscordGuild = Guild;

export class Cost {
    private _type?: keyof UserCurrency
    private _amount?: number
    private _sale?: Cost
    toString () {
        const thisString = Functions.toMoneyString(this._amount, "user", this._type);
        return this._type && (this._amount || this._amount === 0 ) ? (this._sale ? `~~${thisString}~~ ${this.sale.type === this.type ? Functions.formatNumber(this.sale.amount) : Functions.toMoneyString(this.sale.amount, "user", this.sale.type)}` : thisString) : "Не доступен для покупки"
    }

    get type (): keyof UserCurrency {
        return this._sale ? this._sale.type : this._type
    }

    get amount (): number {
        return this._sale ? this._sale.amount : this._amount
    }

    get sale () {
        return this._sale || null;
    }

    isEnough (data: ObjectType<keyof UserCurrency, number, true>) {
        if (!this.type) return null;
        return this.amount <= data[this.type];
    }

    constructor ();
    constructor (type: keyof UserCurrency, amount: number)
    constructor (type: keyof UserCurrency, amount: number, sale: Cost)
    constructor (type?: keyof UserCurrency, amount?: number, sale?: Cost) {
        if (type) this._type = type;
        if (amount || amount === 0) this._amount = amount;
        if (sale) this._sale = sale;
    }
}

