import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";
import { UserData } from "../../database/models/Guild";
import { stripIndents } from "common-tags";
// import { profileIm } from "discord-arts";
import { AttachmentBuilder } from "discord.js";
import profileImage from "../../custom-modules/profileImage";
import { Levels } from "../../custom-modules/Level-xp";
import { HeroAttributesEnum } from "../../heroes/heroes-attr";

export default new SlashCommand ({
    id: "profile",
    category: "Game",
    data: new SlashBuilder()
        .setName("profile")
        .setDescription("Открыть профиль пользователя")
        .addUserOption(o => o
            .setName("user")
            .setDescription("Цель")),
    async execute ({interaction, options, thisGuild, thisUser, Database, Builder, client, F, thisUserGame}) {
        await interaction.deferReply()
        const user = options.getUser("user") || interaction.user;
        let userData = thisUserGame;
        if (user.id !== interaction.user.id) {
            userData = await Database.get("Game").findOrCreate(user)};
        const userInGuild: UserData = thisGuild.usersMessages[user.id] || {messages: 0};
        const userInGuildDaily: UserData = thisGuild.usersMessagesDaily[user.id] || {messages: 0};

        const image = await profileImage(user);
  
        const att = new AttachmentBuilder(image, {name: "image.png"});
        const resolved = F.resolveGames(userData.heroes);
        const _games = resolved.games || 0;
        const _wins = resolved.wins || 0;
        
        Builder.createEmbed()
            .setTitle("Никнейм: " + userData.nickname)
            .setImage("attachment://image.png")
            .setText(stripIndents`
                **Всего героев:** ${F.formatNumber(Object.keys(userData.heroes).length)}
                **Уровень:** ${F.levelFormat(userData.xp || 0)}
                **Всего игр:** ${F.formatNumber(_games)}
                **Всего побед:** ${F.formatNumber(_wins)} (${F.wr(_games, _wins)})
                **Приключения:** ${F.formatNumber(userData.adventures + 1)}
                **Всего сообщений на этом сервере:** ${F.formatNumber(Math.round(userInGuild.messages))}
                **Всего сообщений на этом сервере за сегодня:** ${F.formatNumber(Math.round(userInGuildDaily.messages))}
            `)
            .editReply(interaction, {files: [att]})
        
    }
})

