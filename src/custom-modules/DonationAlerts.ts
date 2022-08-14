import { stripIndents } from "common-tags";
import { User } from "discord.js";
import DA, { EventName } from "donationalerts-api";
import { client } from "..";
import { Donate_Channel, _dev } from "../config";
import Database from "../database/db";
import { PrimaryMoneyBuy } from "../docs/CommandSettings";
import { DiscordComponentBuilder } from "../structures/DiscordComponentBuilder";

export default async function HandleDonationAlerts (socket: DA.DASocket) {
    socket.on(EventName.Donation, async (donation) => {
        const id = (donation.username || "").split(" ")[0];
        const userData = await Database.get("User").findOne("_id", id);
        if (!userData) return;
        const game = await Database.get("Game").findOne("_id", id);
        const message = (donation.message || "").trimStart();
        const number = message.split(" ")[0];
        if (!number.startsWith("#")) return;
        const index = parseInt(number.slice(1));
        if (!index) return;
        const item = PrimaryMoneyBuy[index-1]
        if (!item) return;
        if (item.inRub > donation.amountMain) return;
        await Database.changeMoney({targetId: id, type: "user", moneyType: "primary", amount: item.primaryAmount});
        console.log(`user: ${id}\namount: ${donation.amountMain}\nnumber: ${number}`)
        let channel
        try {
            channel = await client.channels.fetch(Donate_Channel);
            channel && new DiscordComponentBuilder(client).createEmbed().setTitle("Новый Донат").setText(stripIndents`
            Никнейм: ${game?.nickname || "—Неизвестный"} (${id})
            Сумма доната: ${donation.currency} ${donation.amountFormatted} (${donation.amountMain})
            Индекс Предмета: ${number}
            `).sendToChannel(channel);
        } catch {}
    })
}
