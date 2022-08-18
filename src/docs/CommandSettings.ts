import { Util } from "client-discord";
import { EmojiResolvable } from "discord.js";
import { User } from "../database/models/User";
import { HeroAttribute, HeroAttributesEnum, HeroSkinRarityNames } from "../heroes/heroes-attr";
import { Currency, GuildCurrency } from "../structures/Currency";
import { Cost, ObjectType } from "../structures/MainTypes";

export const RaritySkinCost: ObjectType<keyof Omit<typeof HeroSkinRarityNames, "common">, number> = {
    elite: 150,
    special: 799,
    epic: 1099,
    legendary: 1599,
}

export const PrimaryMoneyBuy: ReadonlyArray<{primaryAmount: number, inRub: number}> = [
    {
        primaryAmount: 5000,
        inRub: 2000
    },
    {
        primaryAmount: 2500,
        inRub: 1200
    },
    {
        primaryAmount: 1500,
        inRub: 750
    },
    {
        primaryAmount: 500,
        inRub: 350
    },
    {
        primaryAmount: 100,
        inRub: 50
    },
];

export const PrimaryToSecondary: ReadonlyArray<ObjectType<"secondary" | "primary", number>> = [
    {
        primary: 50,
        secondary: 500
    },
    {
        primary: 150,
        secondary: 1750
    },
    {
        primary: 500,
        secondary: 6000
    }
]

export const PunishmentActionsSlots = {
    basic: 5,
    premium: 15
}

export const HelpBackgroundImage = "https://i.ibb.co/kcGvLjp/a-79e8a26777db5f5c6f077b3a02a7ac8b.gif";

export const CommandUseReward: number = 5;

export const DailyReward: number = 50;

export const MinRoleCost: number = 100;

export const GiveawayEmoji: EmojiResolvable = "🎉";

export const MaxLevel: number = 100;

export const OnNewLevelAddingAttr: HeroAttribute = new HeroAttribute({dmg: 10, hp: 250, dxt: 2});

export const XpEmoji: EmojiResolvable = "<:xp:1005433998618660905>";

export const BonusBuying: ObjectType<keyof typeof HeroAttributesEnum, {amount: number, cost: Cost}> = {
    dmg: {
        amount: 3,
        cost: new Cost("primary", 5)
    },
    hp: {
        amount: 120,
        cost: new Cost("primary", 5)
    },
    dxt: {
        amount: 2,
        cost: new Cost("primary", 5)
    },
}

export const RoleShopSlots = {
    basic: 5,
    premium: 15
}

export const MaxNicknameLength: number = 40;

export const HeroCostIfExists: number = 15;

export const UserDatabaseOptions: Partial<User> = { packs: {startpack: 1, big_chest: 1} }

export const UserXpAfterWin = () => Util.random(25, 75);

export const HeroXpAfterWin = () => Util.random(12, 45);

export const DuelMoney = () => Util.random(55, 355);

export const RateMoney = () => Util.random(40, 255);

export const PremiumServerDuration: {duration: string, cost: {type: keyof GuildCurrency, amount: number}, visual: string }[] = [
    {
        cost: {type: "secondary", amount: 25000},
        duration: "30d",
        visual: "1 месяц"
    },
    {
        cost: {type: "secondary", amount: 50000},
        duration: "90d",
        visual: "3 месяцев"
    }
]