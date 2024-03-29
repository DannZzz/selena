import { Event } from "../structures/Event";
import translate from 'translate-google';
import { DiscordComponentBuilder } from "../structures/DiscordComponentBuilder";
import { stripIndents } from "common-tags";
import { Message, MessageReaction } from "discord.js";
import Emoji from "node-emoji";
import { Util } from "client-discord";

const _cooldowns = new Set<string>();
export default new Event ({
    event: 'messageReactionAdd',
    async execute(client, reaction, _user) {
        const emoji = Emoji.find(reaction.emoji.name) 
        if (!emoji || !emoji?.key?.startsWith("flag-")) return;
        let message: Message = null;
        try {
            message = await reaction.message.fetch();
        } catch {console.log("cant fetch message to translate")}
        if (!message || (!message.content && !message?.embeds?.[0]?.description)) return;
        const locale = emoji.key.split("-")[1];
        if (_cooldowns.has(`${message.id}$${locale}`)) return;
        await translate(message.content || message?.embeds?.[0]?.description, {to: checkAnothers(locale)}).then(async res => {
            _cooldowns.add(`${message.id}$${locale}`)
            let user = null;
            try {
                user = await _user?.fetch();
            } catch {}
            
            setTimeout(() => _cooldowns.delete(`${message.id}$${locale}`), 15 * 1000);
            // .setTitle(`Перевод с :flag_${res.from.language.iso}: на :flag_${locale}:`)
            new DiscordComponentBuilder().createEmbed().setTitle(`Перевод на :flag_${locale}:`).setText(stripIndents`> ${Util.shorten(res, 4080)}`).setAuthor(message.author.username + " говорит..", message.author.avatarURL()).setUser(user as any).messageReply(message as any)
            
        }).catch(() => {})
    }
})


function checkAnothers(key: string): string {
    const other = {
        al: "sq",
        am: "hy",
        cn: "zh-cn",
        cz: "cs",
        dk: "da",
        gb: "en",
        ge: "ka",
        gr: "el",
        in: "hi",
        jp: "ja",
        kz: "kk",
        kr: "ko",
        ir: "fa", //
        ua: "uk",
    }

    return other[key] || key;
}