import { ColorResolvable, EmojiResolvable } from "discord.js";

export const TOKEN = processOr("TOKEN", "MTAwOTA4NTQwMzkzMzk3MDQ3Mw.Gg4oDG.JMhqaOdYec_WJbkOa16eGPOZZS5ibB4sIiFNL4");
export const DonationAlertsToken: string = processOr("DonationAlertsToken", "zKPAYxgh5wFdmfhME8QQ");
export const MONGO_URI: string = processOr("MONGO_URI", 'mongodb+srv://DannTest:099075020@botdiscord.hkvvx.mongodb.net/selenadiscord');
export const DEV_SERVER: string = processOr("DEV_SERVER", "839462072970641419");
export const GLOBAL_COMMANDS: "false" | "true" = processOr("GLOBAL_COMMANDS", "false") as any;
export const ONLY_DEV_SERVER: "false" | "true" = processOr("ONLY_DEV_SERVER", "true") as any;
export const CLIENT_ID: string = processOr("CLIENT_ID", "1009085403933970473");
export const PAGINATION_EMOJIS: EmojiResolvable[] = ["<:tostart:1009886731438407751>", "<:leftarrow:1002199724637565048>", "<:cancel:1002202404684566578>", "<:rightarrow:1002199719457607770>", "<:toend:1002199721877717053>"]
export const DEFAULT_PREFIX: string = "s!";
export const _dev = "382906068319076372";
export const Donate_Channel: string = processOr("Donate_Channel", "949335983596376095");
export const SUPPORT_SERVER_LINK: string = processOr("SUPPORT_SERVER_LINK", "https://discord.gg/sMDv6BaWby");

export const DonationAlertsLink: string = processOr("DonationAlertsLink", "https://www.donationalerts.com/r/dann_selena");

export const PORT = +processOr("PORT", 3000 + "");

export const WebName: string = processOr("WebName", "http://localhost:"+PORT);

export const OneDayMs = 86400 * 1000;

export const ColorObject: {[k: string]: ColorResolvable} = {
    main: "#ED53C5",
    error: "Red",
    success: "Green",
    none: "#2f3136"
}

export function teamType(id: string): "developer" | "admin" {
    if (_dev === id) return "developer";
    const _admins = [];
    if (_admins.includes(id)) return "admin";
    return null;
}

export function processOr (key: string, dflt: string = null) {
    return process.env[key] || dflt;
}