import { processOr } from "../config";
import Database from "../database/db";
import { Functions as F } from "../structures/Functions";

export class Badge {
    static readonly emojis = {
        0: "",
        1: "<:1:1009888126149341235>", 
        2: "<:2:1009888123804729444>", 
        3: "<:3:1009888128900812850>",
        4: "<:4:1009888136802865162>",
        5: "<:5:1009888134110122066>",
        6: "<:6:1009888131568386079>",
        7: "<:7:1009888116997374034>",
        8: "<:8:1009888119207764101>",
        9: "<:9_:1009888121443328111>",
        mostgames: "<:mostgames:1009888114296233994>",
        mostwins: "<:mostwins:1009888112081649694>",
        mostxp: "<:mostxp:1009888109011402772>",
    };

    static get maxRankBadge () {
        return +processOr("MaxRangBadge", `${9}`)
    }

    static readonly badgesByLevel = {
        1: 3,
        2: 10,
        3: 20,
        4: 30,
        5: 50,
        6: 70,
        7: 100,
        8: 140,
        9: 200
    }

    static rankFor (level: number): string
    static rankFor (level: number, number: boolean): number
    static rankFor (level: number, number?: boolean): string | number {
        const rank = Object.entries(this.badgesByLevel).reverse().find(([rank, l]) => l <= level) || 0;
        return number ? +rank[0] : this.emojis[rank[0]] || "";
    }

    static async fetchUserBadges (userId: string) {
        const games = await Database.get("Game").findMany({xp: {$exists: true}});
        let badges: string[] = [];

        games.sort((a, b) => b.xp - a.xp)?.[0]?._id === userId && badges.push(this.emojis.mostxp);

        games.sort((a, b) => {
            const br = F.resolveGames(b.heroes);
            const ar = F.resolveGames(a.heroes);
            return br.wins - ar.wins;
        })?.[0]?._id === userId && badges.push(this.emojis.mostwins);

        games.sort((a, b) => {
            const br = F.resolveGames(b.heroes);
            const ar = F.resolveGames(a.heroes);
            return br.games - ar.games;
        })?.[0]?._id === userId && badges.push(this.emojis.mostgames);

        return badges
    }
}