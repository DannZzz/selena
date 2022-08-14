import { Collection, CommandInteraction } from "discord.js";
import { SlashCommand } from "./SlashCommand";
const cooldowns = new Collection<string, Collection<string, number>>()

export class Cooldown {
    cooldowns: Collection<string, Collection<string, number>> = cooldowns;
    constructor (readonly command: SlashCommand, readonly interaction: CommandInteraction) {
        if (!this.cooldowns.has(command.id)) {
            this.cooldowns.set(command.id, new Collection());
        }
    }

    isLimited() {
        const currentTime = Date.now();
        const time_stamps = cooldowns.get(this.command.id);
        const cooldownAmount = (this.command.cooldown || 1.5) * 1000;
    
        var toReturn: number = null;
        
        if (time_stamps.has(this.interaction.user.id)) {
            const expire = time_stamps.get(this.interaction.user.id) + cooldownAmount;
            if (currentTime < expire) {
                const time = (expire - currentTime) / 1000;
    
                toReturn = time;
            } else {
                time_stamps.set(this.interaction.user.id, currentTime);
                setTimeout(() => time_stamps.delete(this.interaction.user.id), cooldownAmount);
            }
        } else {
            time_stamps.set(this.interaction.user.id, currentTime);
            setTimeout(() => time_stamps.delete(this.interaction.user.id), cooldownAmount);
        }
        return toReturn;
    }
}