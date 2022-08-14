import { SelectMenuOptionBuilder, SelectMenuComponentOptionData, APISelectMenuOption, RestOrArray } from "discord.js";
import { HelpBackgroundImage } from "../../docs/CommandSettings";
import { SlashBuilder, SlashCommand, SlashCommandCategoryEnum } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "help",
    category: "Information",
    data: new SlashBuilder()
        .setName("help")
        .setDescription("Открыть список команд")
    ,
    async execute ({client, commands, interaction, Builder, F}) {
        const builder = Builder.createEmbed().setThumbnail(client.user.displayAvatarURL()).setText(`Привеет, я **${client.user.username}**, многофункциональный бот написанный на языке TypeScript.\nВот что я умею!`).setImage(HelpBackgroundImage);
        const menu = Builder.createSelectMenu().setCustomId("help-menu").setPlaceHolder("Выберите категорию");
        const options: RestOrArray<SelectMenuOptionBuilder | SelectMenuComponentOptionData | APISelectMenuOption> = []
        
        for (let key in SlashCommandCategoryEnum) {
            const cmds = commands.filter(c => c.category === key);
            builder.addField(`${SlashCommandCategoryEnum[key]}`, cmds.map(c => `\`${c.data.name}\``).join(", "));
            const splited = SlashCommandCategoryEnum[key].split(" ");
            options.push({label: splited[1], value: key, emoji: F.resolveEmoji(splited[0])});
        }
        
        builder.interactionReply(interaction, {components: [menu.setOptions(options).toActionRow() as any]});
        
    }
})