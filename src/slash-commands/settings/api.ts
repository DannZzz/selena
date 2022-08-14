import { stripIndents } from "common-tags";
import { WebName } from "../../config";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "api",
    category: "Settings",
    data: new SlashBuilder()
        .setName("api")
        .setDescription("Информация о нашем API")
    ,
    async execute ({interaction, Builder}) {
        Builder.createEmbed()
            .setTitle(`Открытый API`)
            .setText(stripIndents`
            Мы открываем наш API для других разработчиков!
            Что это означает?
            С помощью API, другие разработчики могут получать данные из нашей базы.
            `)
            .addField(`Q. Как использовать API?`, `A. Наша основная ссылка \`${WebName}/api\`. Вам нужно отправить Web Request, чтобы получить ответ с данным.`)
            .addField(`Q. Какие данные я могу получить?`, `A. В настоящее время можно получить только статистику пользователей (герои, игры и уровни) и серверов.`)            
            .addField(`Q. Как получить данные пользователя?`, `A. Данные можно получить с помощью ID,\nДля пользователей \`${WebName}/api/users/{ID}\`\nДля серверов \`${WebName}/api/servers/{ID}\`\n\nНапример:\n**<${WebName}/api/users/382906068319076372>**\n**<${WebName}/api/servers/839462072970641419>**`)
            .interactionReply(interaction);            
    }
})