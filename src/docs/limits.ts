import { processOr } from "../config";
import { HeroAttributesEnum, HeroSkinRarityNames } from "../heroes/heroes-attr";
import { ObjectType } from "../structures/MainTypes";

export const SkinLimits: ObjectType<keyof typeof HeroSkinRarityNames, Date, true> = {
    egyptian: StringToDaTe(processOr("EgyptianLimit", "2022/8/10")),
    moon: StringToDaTe(processOr("MoonLimit", "2022/8/1")),
}

export const LimitedSkinsBuff: ObjectType<keyof typeof HeroSkinRarityNames, ObjectType<keyof typeof HeroAttributesEnum, number, true>, true> = {
    moon: {dmg: 120, hp: 600},
    egyptian: {dmg: 100},
}

type Year = number;
type Month = number;
type Day = number;

function StringToDaTe(string: `${Year}/${Month}/${Day}`): Date;
function StringToDaTe(string: any): Date;
function StringToDaTe(string: `${Year}/${Month}/${Day}` | any): Date {
    const str = string.split("/").map(x => +x).slice(0, 3);
    return new Date(str[0], str[1], str[2])
}
