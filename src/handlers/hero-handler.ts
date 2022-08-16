import path from "path";
import fs from "fs";
import { Hero, _heroCollection } from "../heroes/Heroes";
import { Pack, _packCollection } from "../heroes/Packs";
import { HeroCollection, _heroCollection_Collection } from "../heroes/Collections";

export default async function HeroHandler () {
    const eventFolder = fs.readdirSync(path.join(__dirname, "../heroes/list")).filter(c => c.endsWith(".ts") || c.endsWith(".js"));
    for (let eventFileName of eventFolder) {
        const event = await importFile(path.join(__dirname, "../heroes/list/"+eventFileName)) as Hero;
        _heroCollection.set(event.id, event);
    }

    const packFolder = fs.readdirSync(path.join(__dirname, "../heroes/packs")).filter(c => c.endsWith(".ts") || c.endsWith(".js"));
    for (let packFileName of packFolder) {
        const pack = await importFile(path.join(__dirname, "../heroes/packs/"+packFileName)) as Pack;
        _packCollection.set(pack.id, pack);
    }

    const collectionFolder = fs.readdirSync(path.join(__dirname, "../heroes/collections")).filter(c => c.endsWith(".ts") || c.endsWith(".js"));
    for (let collectionFileName of collectionFolder) {
        const collection = await importFile(path.join(__dirname, "../heroes/collections/"+collectionFileName)) as HeroCollection;
        _heroCollection_Collection.set(collection.id, collection);
    }
    
}

async function importFile (path: string) {
    return (await import(path))?.default;
}