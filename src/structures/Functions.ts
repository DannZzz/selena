import { Util } from "client-discord";
import { APIMessageComponentEmoji, Collection, CommandInteraction, Guild, GuildMember, NonThreadGuildBasedChannel, Role, Snowflake } from "discord.js";
import moment from "moment";
import { Levels } from "../custom-modules/Level-xp";
import { Game } from "../database/models/Game";
import { MaxLevel, XpEmoji } from "../docs/CommandSettings";
import { Hero, Heroes } from "../heroes/Heroes";
import { HeroResolvable } from "../heroes/heroes-attr";
import { CurrencyType, Currency } from "./Currency";
import { Punishment } from "./CustomEventTypes";
import { DiscordComponentBuilder } from "./DiscordComponentBuilder";
import { ObjectType } from "./MainTypes";

export class Functions {
    /**
     * @param obj any object
     * @param keys keys array
     * @returns object with keys of array 
     */
    static ObjectFromKeys<O extends ObjectType, A extends readonly string[]>(obj: O, keys: A): ObjectType<A[number], O[A[number]]> {
        const _obj = {} as any;
        for (let key in obj) {
            if (keys.includes(key)) {
                _obj[key] = obj[key]
            };
        }
        return _obj;
    }

    static formatNumber (number: number) {
        return Util.formatNumber(Math.round(number));
    }

    static wr (games: number, wins: number): string {
        return (((wins || 0) / (games || 0) * 100) || 0).toFixed(1) + "%";
    }

    static resolveGames (heroes: Game['heroes']) {
        return Object.entries(heroes || {})?.reduce((d, [heroId, mongo]) => {
            d['games'] += mongo['games'] || 0;
            d['wins'] += mongo['wins'] || 0;
            d['skins'] += (((mongo?.['skinsHave'] || []).filter(s => s !== heroId))?.length || 0)
            return d;
        }, {games: 0, wins: 0, skins: 0}) || {games: 0, wins: 0, skins: 0};
    }

    static async fetchMember (interaction: CommandInteraction, id: Snowflake): Promise<GuildMember> {
        let member: GuildMember
        try {
            member = await interaction.guild.members.fetch(id);
            return member;
        } catch {
            new DiscordComponentBuilder().createEmbed().setUser(interaction.user).setError("Участик сервера не найден.").interactionReply(interaction);
            return null;
        }
    }

    static resolveEmoji (emoji: any) {
        let d;
        if (emoji.startsWith("<")) {
            const splited = (emoji as string).replaceAll(/[<>]/g, "").split(":").filter(x => x);
            d = {id: splited[1], name: splited[0]};
        } else {
            d = {name: emoji as any};
        }
        return d as APIMessageComponentEmoji;
    }

    static validWarns (punishments: Punishment[]) {
        return (punishments || []).filter(p => !p.removed && (p.until ? p.until > new Date() : true));
    }


    static toMoneyString<K extends keyof CurrencyType>(amount: number, type: K, moneyType: keyof CurrencyType[K]) {
        return `${Currency.types[type][moneyType]} ${Util.formatNumber(Math.round(amount))}`
    }

    static percentOf (sum: number, percent: number) {
        return Math.round(percent / 100 * sum);
    }

    static async fetchCollection<K extends keyof fetchData>(guild: Guild, collection: K): Promise<Collection<string, fetchData[K]>> {
        let items = guild?.[collection]?.['cache'] || null;
        try {
            items = await guild?.[collection]?.fetch();
        } catch {}
        return items as any;
    }

    static getMessageLink (guildId: string, channelId: string, messageId: string) {
        return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`
    }

    static isLimited (date: Date) {
        return date ? date > new Date() : false;
    }

    static andOr (array: string[], or?: boolean) {
        return array.map((n, i) => {
            let symbol = ", ";
            if (i === array.length - 1) {
                symbol = "";
            } else if (i === array.length - 2) {
                symbol = or ? " или " : " и ";
            }
            return `${n}${symbol}`
        }).join("")
    }

    static resolveHero(hero: HeroResolvable): Hero[] {
        if (typeof hero !== "string" && "heroes" in hero) {
            return hero.heroes;
        }
        return typeof hero === "string" ? [Heroes.find(hero)] : [hero];
    }

    static levelFormat (xp: number) {
        const lvl = Levels.levelFor(xp) || 1;
        return `${lvl === MaxLevel ? "MAX " : ""}${this.formatNumber(lvl)} (${XpEmoji} ${this.formatNumber(xp)})`
    }

    static moment (input?: moment.MomentInput, locale?: moment.LocaleSpecifier): moment.Moment {
        const m = moment(input);
        m.locale(locale || "ru");
        return m;
    }
}

interface fetchData {
    roles: Role
    channels: NonThreadGuildBasedChannel
    members: GuildMember
}