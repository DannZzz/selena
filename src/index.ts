import { Client } from "client-discord";
import { GatewayIntentBits, Partials } from "discord.js";
import { DASocket } from "donationalerts-api";
import { ColorObject, DonationAlertsToken, TOKEN } from "./config";
import HandleDonationAlerts from "./custom-modules/DonationAlerts";
import { HandleAll } from "./handlers/handler";
export const client = new Client({allowedMentions: {parse: ["users"]}, token: TOKEN, intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
], colors: ColorObject as any,
partials: [
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember,
    Partials.Message,
    Partials.Channel,
]});
HandleAll(client);
const DaSocket = new DASocket(DonationAlertsToken);
HandleDonationAlerts(DaSocket);