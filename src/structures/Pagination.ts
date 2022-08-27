import { ButtonInteraction, CommandInteraction, EmojiResolvable, Interaction, Message, ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder, ModalSubmitInteraction, SelectMenuInteraction, APIMessageComponentEmoji, InteractionCollector } from "discord.js";
import { PAGINATION_EMOJIS } from "../config";
import { DiscordComponentBuilder } from "./DiscordComponentBuilder";

export interface PaginationOptions {
    readonly interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction;
    readonly embeds: EmbedBuilder[]
    readonly attachments?: AttachmentBuilder[];
    readonly timeout?: number
    readonly validIds: string[]
    readonly emojis?: EmojiResolvable[]
    readonly otherButtons?: {button: ButtonBuilder, onclick: (interaction: ButtonInteraction) => any, end?: boolean}[]
    readonly endCallback?: (timeout: boolean) => any
    readonly startCallback?: () => any
    readonly editReply?: true
}

export class Pagination implements PaginationOptions {
    readonly interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction;
    readonly attachments?: AttachmentBuilder[] = [];
    readonly embeds: EmbedBuilder[];
    readonly timeout?: number = 100000;
    readonly validIds: string[]
    readonly emojis?: EmojiResolvable[]
    readonly endCallback?: (timeout: boolean) => any
    readonly startCallback?: () => any
    readonly otherButtons?: {button: ButtonBuilder, onclick: (interaction: ButtonInteraction) => any, end?: boolean}[]
    readonly editReply?: true

    constructor(options: PaginationOptions) {
        Object.assign(this, options);
    }

    public async createSimplePagination(): Promise<Message> {
        if (this.embeds.length === 0) throw new Error('Pagination: Embeds length must be 1 or more');
       
        var page = 0;

        const buttons = (dis: boolean = false) => [
            new DiscordComponentBuilder().createButton()
                .setCustomId("left")
                .setStyle("Secondary")
                .setDisabled(dis)
                .setEmoji(this.emojis?.[1] || PAGINATION_EMOJIS[1])
                .toButtonBuilder(),
            new DiscordComponentBuilder().createButton()
                .setCustomId("cancel")
                .setStyle("Secondary")
                .setDisabled(dis)
                .setEmoji(this.emojis?.[2] || PAGINATION_EMOJIS[2])
                .toButtonBuilder(),
            new DiscordComponentBuilder().createButton()
                .setCustomId("right")
                .setStyle("Secondary")
                .setDisabled(dis)
                .setEmoji(this.emojis?.[3] || PAGINATION_EMOJIS[3])
                .toButtonBuilder()
        ]
        const dis = this.embeds.length === 1 ? true : false;
        const row = new ActionRowBuilder().addComponents(buttons(dis));
        const anotherRow = this.getThisButtons(dis, page) ? new ActionRowBuilder().addComponents(this.getThisButtons(dis, page)) : null;
        const curPage = await this.interaction[this.editReply ? "editReply" : "reply"]({ fetchReply: true, embeds: [this.embeds[page].setFooter({ text: `${page + 1} / ${this.embeds.length}` })], files: this?.attachments?.length > 0 ? [this.attachments[page]] : [] , components: [...([row, anotherRow].filter(m => m) as any[])] }) as Message;

        if (dis) return;
        const collector = curPage.createMessageComponentCollector({
            filter: i => {
                if (i.user.id === this.interaction.user.id) return true;
                i.reply({ ephemeral: true, content: "Команду запросил другой человек." })
            },
            time: this.timeout
        });
        this?.startCallback?.();
        let isClicked = false;

        collector.on("end", () => {
            this.endCallback?.(isClicked);
            const newRow = new ActionRowBuilder().addComponents(buttons(true));
            const anotherRowNew = this.getThisButtons(true, page) ? new ActionRowBuilder().addComponents(this.getThisButtons(true, page)) : null;
            curPage.edit({ components: [...([newRow, anotherRowNew].filter(m => m) as any[])] });
        });

        collector.on("collect", async b => {
            await b.deferUpdate();
            collector.resetTimer();

            switch (b.customId) {
                case "left": {
                    page = page > 0 ? --page : this.embeds.length - 1;
                    break;
                }
                case "right": {
                    page = page + 1 < this.embeds.length ? ++page : 0;
                    break
                }
                case "cancel": {
                    collector.stop();
                    return;
                }
                default: {
                    isClicked = true
                    this.doOtherButton(b as any, page, collector);
                    return
                }

            }
            await curPage.removeAttachments()
            const _row = new ActionRowBuilder().addComponents(buttons(dis));
            const _anotherRow = this.getThisButtons(dis, page) ? new ActionRowBuilder().addComponents(this.getThisButtons(dis, page)) : null;
            await curPage.edit({ embeds: [this.embeds[page].setFooter({ text: `${page+1} / ${this.embeds.length}` })], files: this?.attachments?.length > 0 ? [this.attachments[page]] : [], components: [...([_row, _anotherRow].filter(m => m) as any[])] })
        });

        return curPage;
    }

    public async createAdvancedPagination(): Promise<Message> {
        if (this.embeds.length === 0) throw new Error('Pagination: Embeds length must be 1 or more');
        
        var page = 0;

        const buttons = (dis: boolean = false) => [
            new DiscordComponentBuilder().createButton()
                .setCustomId("mostleft")
                .setStyle("Secondary")
                .setDisabled(dis)
                .setEmoji(this.emojis?.[0] || PAGINATION_EMOJIS[0])
                .toButtonBuilder(),
            new DiscordComponentBuilder().createButton()
                .setCustomId("left")
                .setStyle("Secondary")
                .setDisabled(dis)
                .setEmoji(this.emojis?.[1] || PAGINATION_EMOJIS[1])
                .toButtonBuilder(),
            new DiscordComponentBuilder().createButton()
                .setCustomId("cancel")
                .setStyle("Secondary")
                .setDisabled(dis)
                .setEmoji(this.emojis?.[2] || PAGINATION_EMOJIS[2])
                .toButtonBuilder(),
            new DiscordComponentBuilder().createButton()
                .setCustomId("right")
                .setStyle("Secondary")
                .setDisabled(dis)
                .setEmoji(this.emojis?.[3] || PAGINATION_EMOJIS[3])
                .toButtonBuilder(),
            new DiscordComponentBuilder().createButton()
                .setCustomId("mostright")
                .setStyle("Secondary")
                .setDisabled(dis)
                .setEmoji(this.emojis?.[4] || PAGINATION_EMOJIS[4])
                .toButtonBuilder(),

        ]
        const dis = this.embeds.length === 1 ? true : false;
        const row = new ActionRowBuilder().addComponents(buttons(dis));
        const anotherRow = this.getThisButtons(dis, page) ? new ActionRowBuilder().addComponents(this.getThisButtons(dis, page)) : null;
        const curPage = await this.interaction[this.editReply ? "editReply" : "reply"]({ fetchReply: true, embeds: [this.embeds[page].setFooter({ text: `${page + 1} / ${this.embeds.length}` })], files: this?.attachments?.length > 0 ? [this.attachments[page]] : [] , components: [...([row, anotherRow].filter(m => m) as any[])] }) as Message;
        if (dis) return;
        const collector = curPage.createMessageComponentCollector({
            filter: i => {
                if (i.user.id === this.interaction.user.id) return true;
                i.reply({ ephemeral: true, content: "Команду запросил другой человек." })
            },
            time: this.timeout
        });
        this?.startCallback?.();

        let isClicked = false;

        collector.on("end", () => {
            this.endCallback?.(isClicked);
            const newRow = new ActionRowBuilder().addComponents(buttons(true));
            const anotherRowNew = this.getThisButtons(true, page) ? new ActionRowBuilder().addComponents(this.getThisButtons(true, page)) : null;
            curPage.edit({ components: [...([newRow, anotherRowNew].filter(m => m) as any[])] });
        });

        collector.on("collect", async b => {
            await b.deferUpdate();
            collector.resetTimer();

            switch (b.customId) {
                case "mostleft": {
                    page = 0;
                    break
                }
                case "left": {
                    page = page > 0 ? --page : this.embeds.length - 1;
                    break;
                }
                case "right": {
                    page = page + 1 < this.embeds.length ? ++page : 0;
                    break
                }
                case "mostright": {
                    page = this.embeds.length - 1;
                    break;
                }
                case "cancel": {
                    collector.stop();
                    return;
                }
                default: {
                    isClicked = true;
                    this.doOtherButton(b as any, page, collector);
                    return;
                }
            }
            await curPage.removeAttachments()  
            const _row = new ActionRowBuilder().addComponents(buttons(dis));
            const _anotherRow = this.getThisButtons(dis, page) ? new ActionRowBuilder().addComponents(this.getThisButtons(dis, page)) : null;  
            await curPage.edit({ embeds: [this.embeds[page].setFooter({ text: `${page+1} / ${this.embeds.length}` })], files: this?.attachments?.length > 0 ? [this.attachments[page]] : [], components: [...([_row, _anotherRow].filter(m => m) as any[])] })
        });

        return curPage;
    }

    private getThisButtons (dis: boolean = false, n: number) {
        const bs = [...(this.otherButtons || [])];
        if (!bs[n]) return null;
        return dis ? bs[n].button.setDisabled(dis) : bs[n].button;
    }

    private doOtherButton(i: ButtonInteraction, n: number, collector: InteractionCollector<any>) {
        const bs = [...(this.otherButtons || [])];
        if (!bs[n]) return null;
        if (bs[n].end) collector.stop();
        bs[n].onclick(i);
    }

}