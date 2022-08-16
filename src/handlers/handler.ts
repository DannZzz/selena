import { Client } from "client-discord";
import fs from "fs";
import path from "path";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10"
import { CLIENT_ID, DEV_SERVER, GLOBAL_COMMANDS, MONGO_URI, ONLY_DEV_SERVER, TOKEN } from "../config";
import { Collection } from "discord.js";
import { SlashCommand } from "../structures/SlashCommand";
import { Event } from "../structures/Event";
import mongoose from "mongoose";
import HandleCustomEvents from "./custom-event-handler";
import { GiveawayHandler } from "./GiveawayHandler";
import { ContextMenuCommand } from "../structures/ContextMenuCommand";
import { DailyMessagesHandler } from "./DailyMessagesHandler";
import HeroHandler from "./hero-handler";

export const SlashCollection = new Collection<string, SlashCommand>();
export const DevCollection = new Collection<string, SlashCommand>();
export const MessageContextMenuCollection = new Collection<string, ContextMenuCommand>;

export async function HandleAll (client: Client) {
    // slash commands 
    async function handleSlash () {
        const mainSlashDir = fs.readdirSync(path.join(__dirname, "../slash-commands"));
        mainSlashDir.forEach(async dirName => {
            const commandFolder = fs.readdirSync(path.join(__dirname, "../slash-commands/"+dirName)).filter(c => c.endsWith(".ts") || c.endsWith(".js"));
            for (let commandFileName of commandFolder) {
                const Command = await importFile(path.join(__dirname, `../slash-commands/${dirName}/${commandFileName}`)) as SlashCommand;
                if (!Command.isDisabled) {
                    SlashCollection.set(Command.data.name, Command);
                    if (Command.isDevOnly) DevCollection.set(Command.data.name, Command);
                }
            }
        })
    }

    // // message commands 
    // const mainMessageDir = fs.readdirSync(path.join(__dirname, "../message-commands"));
    // mainMessageDir.forEach(async dirName => {
    //     const commandFolder = fs.readdirSync(path.join(__dirname, "../message-commands/"+dirName)).filter(c => c.endsWith(".ts") || c.endsWith(".js"));
    //     for (let commandFileName of commandFolder) {
    //         const Command = await importFile(path.join(__dirname, `../message-commands/${dirName}/${commandFileName}`));
    //         console.log(Command);
    //     }
    // })

    // events 
    async function handleEvents () {
        const eventFolder = fs.readdirSync(path.join(__dirname, "../events")).filter(c => c.endsWith(".ts") || c.endsWith(".js"));
        for (let eventFileName of eventFolder) {
            const event = await importFile(path.join(__dirname, "../events/"+eventFileName)) as Event<any>;
            if (!event.disabled) {
                client.on(event.event, (data) => {event.execute(client, data)});
            }
        }
    }

    // events 
    async function handleMessageContextMenu () {
        const commandFolder = fs.readdirSync(path.join(__dirname, "../message-interactions")).filter(c => c.endsWith(".ts") || c.endsWith(".js"));
        for (let commandFileName of commandFolder) {
            const command = await importFile(path.join(__dirname, "../message-interactions/"+commandFileName)) as ContextMenuCommand;
            if (!command.isDisabled) {
                MessageContextMenuCollection.set(command.data.name, command);
            }
        }
    }
    

    client.on("error", console.error);
    process.on("unhandledRejection", console.error);
        
    await Promise.all([
        handleMessageContextMenu(),
        handleSlash(),
        handleEvents()
    ]).then(async () => {
        // custom events
        HandleCustomEvents()
            
        mongoose.connect(MONGO_URI);

        await client.login()
        console.log(`Slash Commands loaded: ${SlashCollection.size}`);
        console.log(`Message Context Menu Commands loaded: ${MessageContextMenuCollection.size}`);
        new GiveawayHandler();
        new DailyMessagesHandler();
        HeroHandler();
        registerSlash(client);
    })
    
}

export async function registerSlash (client: Client) {
    console.log("Started registering Slash Commands (/)");
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    if (ONLY_DEV_SERVER) {
        if (DEV_SERVER) {
            // {body: [...DevCollection.values()].map(x => x.data.toJSON())}
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, DEV_SERVER), {body: [...SlashCollection.values(), ...MessageContextMenuCollection.values()].map(x => x.data.toJSON())})
        }
    } else {
        if (GLOBAL_COMMANDS === "true") {
            await rest.put(Routes.applicationCommands(CLIENT_ID), {body: [...SlashCollection.values(), ...MessageContextMenuCollection.values()].filter(x => !x.isDevOnly).map(x => x.data.toJSON())})
        } 
        if (DEV_SERVER) {
            // {body: [...DevCollection.values()].map(x => x.data.toJSON())}
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, DEV_SERVER), {body: [...DevCollection.values()].map(x => x.data.toJSON())})
        }
    }
    
    console.log("Ended registering Slash Commands (/)");
}


export async function importFile (path: string) {
    return (await import(path))?.default;
}