import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "@discordjs/builders";
import { Client } from "client-discord";
import { ActionRow, ActionRowData, APIButtonComponent, APIEmbed, APIMessageComponentEmoji, APISelectMenuComponent, APISelectMenuOption, ButtonInteraction, ButtonStyle, ColorResolvable, Colors, CommandInteraction, EmojiResolvable, GuildMember, GuildTextBasedChannel, Interaction, InteractionReplyOptions, Message, MessageActionRowComponentBuilder, MessageActionRowComponentData, MessageOptions, MessagePayload, ModalSubmitInteraction, resolveColor, RestOrArray, SelectMenuBuilder, SelectMenuComponentOptionData, SelectMenuInteraction, SelectMenuOptionBuilder, TextBasedChannel, User as DiscordUser, User, WebhookEditMessageOptions } from "discord.js";
import { ColorObject } from "../config";
import { Functions } from "./Functions";

export type BasicInteraction = CommandInteraction | ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction;


export class DiscordComponentBuilder {
    private readonly client: Client;

    constructor()
    constructor(client: Client)
    constructor(client?: Client) {
        this.client = client || null;
    }

    /**
     * Create embed
     */
    createEmbed(): Embed;
    /**
     * Create embed
     * 
     * @param options embed api options
     */
    createEmbed(options: APIEmbed): Embed;
    createEmbed(options?: APIEmbed): Embed {
        return new Embed(this.client);
    }

    /**
     * Create button
     */
    createButton(): Button;
    /**
     * Create button
     * 
     * @param options button data
     */
    createButton(options: Partial<APIButtonComponent>): Button;
    createButton(options?: Partial<APIButtonComponent>): Button {
        return new Button(options)
    }

    /**
     * Create select menu
     */
    createSelectMenu(): SelectMenu;
    /**
     * Create select menu
     * 
     * @param options select menu data
     */
    createSelectMenu(options: Partial<APISelectMenuComponent>): SelectMenu;
    createSelectMenu(options?: Partial<APISelectMenuComponent>): SelectMenu {
        return new SelectMenu(options)
    }

    createError(text: string, user?: User) {
        return new Embed(this.client).setUser(user).setError(text)
    }
}

class Button {
    private readonly button: ButtonBuilder;
    constructor (_options?: Partial<APIButtonComponent>) {
        this.button = new ButtonBuilder(_options)
    }

    setStyle (style: keyof typeof ButtonStyle) {
        this.button.setStyle(ButtonStyle[style]);
        return this;
    }

    setCustomId (id: string) {
        this.button.setCustomId(id);
        return this;
    }

    setLabel (label: string) {
        this.button.setLabel(label)
        return this;
    }

    setEmoji (emoji: EmojiResolvable) {
        const { resolveEmoji } = Functions;

        this.button.setEmoji(resolveEmoji(emoji));
        return this;
    }

    setUrl (link: string) {
        this.button.setURL(link);
        return this;
    }

    setDisabled (disabled: boolean) {
        this.button.setDisabled(disabled);
        return this;
    }

    toActionRow () {
        return new ActionRowBuilder().addComponents([this.button]) as any as ActionRowData<MessageActionRowComponentData | MessageActionRowComponentBuilder>
    }

    toButtonBuilder() {
        return this.button;
    }


    clear (options?: Partial<APIButtonComponent>) {
        return new Button(options);
    }
}

class Embed {
    readonly embed: EmbedBuilder;
    constructor(readonly client: Client) {
        this.embed = new EmbedBuilder()
    }

    addField(name: string, value: string, inline: boolean = false) {
        this.embed.addFields({ name, value, inline })
        return this;
    }

    setAuthor(name: string, iconURL?: string, url?: string) {
        this.embed.setAuthor({ name, iconURL, url })
        return this;
    }

    setTitle(title: string) {
        this.embed.setTitle(title);
        return this;
    }

    setColor(color?: ColorResolvable) {
        if (color) {
            this.embed.setColor(resolveColor(color));
        } else {
            if (ColorObject) {
                this.embed.setColor(resolveColor(ColorObject.main));
            }
        }
        return this;
    }

    setFooter(text: string, iconURL?: string) {
        this.embed.setFooter({ text, iconURL })
        return this;
    }

    setUser(user: DiscordUser): this;
    setUser(user: DiscordUser, type: "footer" | "author"): this;
    setUser(member: GuildMember): this;
    setUser(member: GuildMember, type: "footer" | "author"): this;
    setUser(data: {avatarUrl: string, name: string}): this;
    setUser(data: {avatarUrl: string, name: string}, type: "footer" | "author"): this;
    setUser(data: DiscordUser | GuildMember | {avatarUrl: string, name: string}, type: "footer" | "author" = "footer") {
        let name: string, avatarUrl: string;
        if (data instanceof DiscordUser) {
            name = data.username;
            avatarUrl = data.displayAvatarURL();
        } else if (data instanceof GuildMember) {
            avatarUrl = data.displayAvatarURL();
            name = data.user.username;
        } else {
            name = data.name;
            avatarUrl = data.avatarUrl;
        }
        if (type === "author") {
            this.setAuthor(name, avatarUrl);
        } else {
            this.setFooter(`Запросил(а) ${name}`, avatarUrl)
        }
        return this;
    }

    setText(text: string, onlyText?: boolean) {
        this.embed.setDescription(text);
        if (!onlyText) this.setColor();
        return this;
    }

    setImage(link: string) {
        this.embed.setImage(link);
        return this;
    }

    setThumbnail(link: string) {
        this.embed.setThumbnail(link);
        return this;
    }

    setTimestamp(date?: number | Date) {
        this.embed.setTimestamp(date);
        return this;
    }

    setUrl(link: string) {
        this.embed.setURL(link);
        return this;
    }

    setError(text: string) {
        this.embed.setDescription(text);
        this.setColor(ColorObject?.error);
        return this;
    }

    setSuccess(text: string) {
        this.embed.setDescription(text);
        this.setColor(ColorObject?.success);
        return this;
    }

    clear() {
        return new Embed(this.client);
    }

    sendToChannel(channel: GuildTextBasedChannel, options?: Omit<MessageOptions, "embeds">) {
        return channel.send({ embeds: [this.embed], ...(options || {}) })
    }

    messageReply(message: Message, options?: Omit<MessageOptions, "embeds">) {
        return message.reply({ embeds: [this.embed], ...(options || {}) })
    }

    interactionReply(interaction: BasicInteraction, options?: Omit<InteractionReplyOptions, "embeds">) {
        return interaction.reply({ embeds: [this.embed], ...(options || {}) });
    }

    interactionFollowUp(interaction: BasicInteraction, options?: Omit<InteractionReplyOptions, "embeds">) {
        return interaction.followUp({ embeds: [this.embed], ...(options || {}) });
    }

    editReply(interaction: BasicInteraction, options?: Omit<WebhookEditMessageOptions, "embeds">) {
        return interaction.editReply({...(options || {}), embeds: [this.embed]});
    }

    toEmbedBuilder () {
        return this.embed;
    }
}

class SelectMenu {
    private menu: SelectMenuBuilder
    constructor (options?: Partial<APISelectMenuComponent>) {
        this.menu = new SelectMenuBuilder(options);
    }

    setPlaceHolder(text: string): this {
        this.menu.setPlaceholder(text);
        return this;
    }

    setCustomId (id: string): this {
        this.menu.setCustomId(id);
        return this;
    }

    setMaxValues(number: number): this {
        this.menu.setMaxValues(number);
        return this;
    }

    setMinValues(number: number): this {
        this.menu.setMinValues(number);
        return this;
    }

    setDisabled(disabled: boolean): this {
        this.menu.setDisabled(disabled);
        return this;
    }

    setOptions (options: RestOrArray<SelectMenuOptionBuilder | SelectMenuComponentOptionData | APISelectMenuOption>): this {
        this.menu.setOptions(...options);
        return this;
    }

    toActionRow () {
        return new ActionRowBuilder().addComponents([this.menu]);
    }

    toSelectMenuBuilder() {
        return this.menu;
    }


    clear (options?: Partial<APISelectMenuComponent>) {
        return new SelectMenu(options);
    }
}