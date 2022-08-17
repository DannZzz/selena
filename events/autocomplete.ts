import { AutocompleteInteraction, InteractionType } from "discord.js";
import { Levels } from "../custom-modules/Level-xp";
import Database from "../database/db";
import { SlashCollection } from "../handlers/handler";
import { HeroNames } from "../heroes/hero-names";
import { Heroes } from "../heroes/Heroes";
import { Packs } from "../heroes/Packs";
import { Event } from "../structures/Event";
import { Functions } from "../structures/Functions";

export default new Event ({
    event: "interactionCreate",
    async execute(client, interaction) {
        if (interaction.type !== InteractionType.ApplicationCommandAutocomplete) return;

        const command = SlashCollection.get(interaction.commandName);
        if (!command) return;
        const focusedValue = interaction.options.getFocused();
        if (command.autocomplete === "command") {
            const filtered = SlashCollection.filter(cmd => cmd.data.name.toLowerCase().includes(focusedValue.toLowerCase()))
            send(interaction, filtered.map(c => c.data.name));
        } else if (command.autocomplete === "hero") {
            const filtered = Object.values(HeroNames).filter(cmd => cmd.toLowerCase().includes(focusedValue.toLowerCase()));
            send(interaction, filtered)
        } else if (command.autocomplete === "my-heroes") {
            const myData = await Database.get("Game").findOrCreate(interaction.user);
            const RuNames = Object.entries(myData.heroes).map(([heroId, mongoHero]) => {
                const hero = Heroes.find(heroId);
                return {name: `${hero.elements} ${hero} (${Functions.formatNumber(Levels.levelFor(mongoHero.xp))} lvl)`, value: hero.id}
            })
            send(interaction, RuNames.filter(cmd => cmd.name.toLowerCase().includes(focusedValue.toLowerCase())))
        } else if (command.autocomplete === "my-packs") {
            const data = await Database.get("User").findOrCreate("_id", interaction.user.id);
            const packs = Packs.resolveUserPacks(data.packs);
            send(interaction, Object.entries(packs).filter(([id, [number, pack]]) => pack.name.toLowerCase().includes(focusedValue.toLowerCase())).map(([id, [number, pack]]) => {
                return {name: `${pack.name} - ${Functions.formatNumber(number)}`, value: pack.name}
            }))
        }
    }
})

async function send(interaction: AutocompleteInteraction, filteredArray: string[]| {name: string, value: string}[]) {
    const toSend = (typeof filteredArray[0] === "string" ? filteredArray.map(cmd => {return {name: cmd, value: cmd}}) : filteredArray).slice(0, 25)
    if (toSend.length > 0) await interaction.respond(toSend as any);
}