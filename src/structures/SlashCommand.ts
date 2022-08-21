import { Client } from "client-discord";
import { CommandInteraction, CommandInteractionOptionResolver, GuildMember, PermissionFlags, PermissionFlagsBits, PermissionResolvable, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import Database from "../database/db";
import { Guild } from "../database/models/Guild";
import { User } from "../database/models/User";
import { CustomEvent } from "./CustomEvent";
import { DiscordComponentBuilder } from "./DiscordComponentBuilder";
import { Functions } from "./Functions";
import { SlashCollection } from "../handlers/handler";
import { Heroes } from "../heroes/Heroes";
import { Game } from "../database/models/Game";
import { Levels } from "../custom-modules/Level-xp";

export enum SlashCommandIdEnum {
    // moderation
    "ban",
    "kick",
    "mute",
    "unmute",
    "clear",
    "warns",
    "warn-actions",
    // reaction
    "hug", 
    "kiss", 
    "slap", 
    "wink", 
    "pat", 
    "kill", 
    "cuddle", 
    "punch", 
    // 
    "avatar",
    "server-info",
    "help",
    "disable-command",
    "profile",
    "deposit",
    "daily",
    "api",
    "shop",
    "buy-role",
    "set-role",
    "remove-role",
    "giveaway",
    "colors",
    "messages-top",
    "spank",
    "hero",
    "change-money",
    "my-balance",
    "my-heroes",
    "adventures",
    "duel",
    "heroes",
    "element-info",
    "open-pack",
    "rating",
    "bonus",
    "change-xp",
    "premium-server",
    "crystals",
    "top",
    "change-nickname",
    "rank",
    "pack-info",
}

export enum SlashCommandCategoryEnum {
    "Information" = "❕ Информационные",
    "Moderation" = "🔒 Модерация",
    "Settings" = "⚙ Настройки",
    "Reaction" = "🎭 Реакционные",
    "Economy" = "💰 Экономика",
    "Game" = "🎃 Рольплей"
}

export type SlashCommandId = keyof typeof SlashCommandIdEnum;
export type SlashCommandCategory = keyof typeof SlashCommandCategoryEnum;
export class SlashCommand {
    id: SlashCommandId
    category: SlashCommandCategory
    data: SlashCommandBuilder | SlashCommandSubcommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder
    execute: (options: SlashCommandExecuteOptions) => Promise<any>
    cooldown?: number
    permissions?: PermissionResolvable
    botPermissions?: PermissionResolvable
    onlyGuildOwner?: boolean
    hideHelp?: boolean
    isDevOnly?: boolean
    isAdAllowed?: boolean
    isDisabled?: boolean
    isPassive?: boolean
    isPremium?: boolean
    isRewardAllowed?: boolean
    autocomplete?: "command" | "hero" | "my-heroes" | "my-packs" | "all-packs"
    
    constructor (options: SlashCommand) {
        Object.assign(this, options);
    }
}

export interface SlashCommandExecuteOptions {
    client: Client
    interaction: CommandInteraction
    options: CommandInteractionOptionResolver
    Builder: DiscordComponentBuilder
    thisGuild: Guild
    thisUser: User
    commands: typeof SlashCollection
    thisUserGame: Game
    me: GuildMember
    Database: typeof Database
    CustomEvent: CustomEvent
    F: typeof Functions
    isGuildPremium: boolean
    isUserVip: boolean
    Heroes: typeof Heroes
    anyData?: any
    Levels: typeof Levels
}

export class SlashBuilder extends SlashCommandBuilder {
    constructor(permission?: keyof typeof PermissionFlagsBits) {
        super();
        this.setDMPermission(false);
        permission && this.setDefaultMemberPermissions(PermissionFlagsBits[permission]);
    }
} 

export function toChoices (array: string[][]) {
    return array.map(arr => {return {name: arr[0], value: arr[1]}})
}