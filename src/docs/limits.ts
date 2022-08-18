import { processOr } from "../config";

export const SkinLimits = {
    egyptian: StringToDaTe(processOr("EgyptianLimit", "2022/8/10")),
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
