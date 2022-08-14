import { Client } from "client-discord";
import { CommandInteraction, CommandInteractionOptionResolver, ContextMenuCommandBuilder, ContextMenuCommandInteraction, GuildMember, Message, PermissionFlagsBits, PermissionResolvable } from "discord.js";
import Database from "../database/db";
import { Guild } from "../database/models/Guild";
import { User } from "../database/models/User";
import { MessageContextMenuCollection, SlashCollection } from "../handlers/handler";
import { CustomEvent } from "./CustomEvent";
import { DiscordComponentBuilder } from "./DiscordComponentBuilder";
import { Functions } from "./Functions";

export enum ContextMenuCommandNamesEnum {
    "end-giveaway",
    "reroll"
}

export type ContextMenuCommandNames = keyof typeof ContextMenuCommandNamesEnum;

export class ContextMenuCommand {
    id: ContextMenuCommandNames
    data: ContextMenuCommandBuilder
    permissions?: PermissionResolvable
    botPermissions?: PermissionResolvable
    onlyGuildOwner?: boolean
    isDisabled?: boolean
    isDevOnly?: boolean
    isPremium?: boolean
    isRewardAllowed?: boolean
    execute: (options: ContextMenuCommandExecuteOptions) => Promise<any>
    
    constructor (options: ContextMenuCommand) {
        Object.assign(this, options);
    }

}

export class ContextMenuBuilder extends ContextMenuCommandBuilder {
    constructor(permission?: keyof typeof PermissionFlagsBits) {
        super();
        this.setDMPermission(false);
        permission && this.setDefaultMemberPermissions(PermissionFlagsBits[permission]);
    }
}

export interface ContextMenuCommandExecuteOptions {
    client: Client
    targetMessage: Message
    interaction: ContextMenuCommandInteraction
    Builder: DiscordComponentBuilder
    thisGuild: Guild
    thisUser: User
    commands: typeof MessageContextMenuCollection
    me: GuildMember
    Database: typeof Database
    CustomEvent: CustomEvent
    F: Functions
    isGuildPremium: boolean
    anyData?: any
}

