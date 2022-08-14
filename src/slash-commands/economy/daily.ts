import { OneDayMs, teamType } from "../../config";
import { DailyReward } from "../../docs/CommandSettings";
import { DateTime } from "../../structures/Date";
import { SlashBuilder, SlashCommand } from "../../structures/SlashCommand";

export default new SlashCommand ({
    id: "daily",
    category: "Economy",
    data: new SlashBuilder()
        .setName("daily")
        .setDescription("Забрать ежедневные эссенции")
    ,
    async execute ({interaction, thisUser, Builder, Database, client, F, CustomEvent}) {
        if (teamType(interaction.user.id) !== "developer" && thisUser.cooldowns.daily && thisUser.cooldowns.daily > new Date()) return Builder.createEmbed().setUser(interaction.user).setError(`Попробуйте снова через **${new DateTime(thisUser.cooldowns.daily).formatTime()}**.`).interactionReply(interaction);
        await Promise.all([
            Database.get("User").updateOne({_id: interaction.user.id}, {$set: {[`cooldowns.daily`]: new Date(Date.now() + OneDayMs)}}),
            Database.changeMoney({targetId: interaction.user.id, amount: DailyReward, type: "user", moneyType: "secondary", CustomEvent})
        ]);
        Builder.createEmbed().setUser(interaction.user).setSuccess(`Вы забрали свои ежедневные эссенции: ${F.toMoneyString(DailyReward, "user", "secondary")}`).interactionReply(interaction);
    }
})