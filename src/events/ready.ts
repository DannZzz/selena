import { Event } from "../structures/Event";
import Database from "../database/db";

export default new Event ({
    event: "ready",
    async execute (client) {
        console.log(`${client.user.tag} - ready!`)
        // Database.get("Game").deleteMany();
    }
})