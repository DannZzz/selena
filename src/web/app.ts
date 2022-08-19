import express from "express";
import http from "http";
import bodyParser from "body-parser";
import socketHandling from "./socketHandling";
import { MONGO_URI, PORT, TopggWebhookAuth } from "../config";
import { Io } from "../structures/Io";
import Database from "../database/db";
import { Functions } from "../structures/Functions";
import { GuildKeysApi } from "../database/models/Guild";
import path from "path";
import { HeroAttribute, HeroId, HeroSkinRarityNames } from "../heroes/heroes-attr";
import { Levels } from "../custom-modules/Level-xp";
import { Heroes } from "../heroes/Heroes";
import mongoose from "mongoose";
import HeroHandler from "../handlers/hero-handler";
import * as Topgg from "@top-gg/sdk";

const TopggWebhook = new Topgg.Webhook(TopggWebhookAuth)

HeroHandler();
mongoose.connect(MONGO_URI).then(() => createApp())


function createApp () {
    const app = express();

    app.use(bodyParser.urlencoded({extended: false}));
    // app.use("/", Static.use('home'));

    app.get("/api/servers/:id", async (req, res) => {
        const id = req.params.id;
        if (!id) return res.json({status: "Error", message: "Parameter id not specified."});
        const guild = await Database.get("Guild").findOne("_id", id);
        if (!guild) return res.json({status: "Error", message: "Server not found."});
        let data = Functions.ObjectFromKeys(guild, GuildKeysApi);
        res.json({status: "Success", data});
    })

    app.get("/api/users/:id", async (req, res) => {
        const access = await isAccessAllowed(req?.query?.accessToken as string);
        const id = req.params.id;
        if (!id) return res.json({status: "Error", message: "Parameter id not specified."});
        const game = await Database.get("Game").findOne("_id", id);
        if (!game) return res.json({status: "Error", message: "Profile not found."});
        const resolved = Functions.resolveGames(game.heroes);
        let data: {_id: string, nickname: string, xp: number, level: number, games: number, wins: number, heroes: Array<{heroId: HeroId, heroName: string, skin: string, avatarURL: string, games: number, wins: number, attr?: HeroAttribute, xp?: number, level?: number}>} = {
            _id: game._id,
            nickname: game.nickname,
            xp: game.xp || 0,
            level: Levels.levelFor(game.xp || 0),
            games: resolved.games || 0,
            wins: resolved.wins || 0,
            heroes: Object.entries(game.heroes || {}).map(([heroId, mongoHero]) => {
                const hero = Heroes.find(heroId);
                const skin = Heroes.findSkin(heroId, mongoHero.skin)
                return {
                    avatarURL: hero.avatarURL(skin?.id || hero.id),
                    games: mongoHero.games || 0,
                    wins: mongoHero.wins || 0,
                    heroId: heroId as HeroId,
                    heroName: hero.name,
                    skin: skin.name,
                    // access
                    xp: access ? mongoHero.xp || 0 : null,
                    level: access ? Levels.levelFor(mongoHero.xp || 0) : null,
                    attr: access ? Heroes.attr(hero.id, mongoHero) : null,
                
                }
            })
        }
        res.json({status: "Success", data});
    })
    
    app.use("/api/hero/avatar/", express.static(path.join(__dirname, `../../hero-images/`)))

    app.use("/api/heroes/all", (req, res) => {
        const list = Heroes.sort();
        res.json({status: "Success", data: list.map(h => {
            return {
                id: h.id,
                name: `${h}`,
                avatarURL: h.avatarURL(),
                Attr: h.attr,
                description: h.description,
                elements: `${h.elements}`,
                skins: h.skins.map(s => {
                    return {
                        name: s.name,
                        avatarURL: h.avatarURL(s.id),
                        rarity: HeroSkinRarityNames[s.rarity]
                    }
                })
            }
        })})
    })

    // app.post("/api/topgg", TopggWebhook.listener(vote => {
    //     console.log(vote)
    //     console.log(vote.user)
    // }))

    app.post("/api/topgg", (req, res) => {
        console.timeLog(req.body)
    })

    // connecting
    const server = http.createServer(app);
    const io = new Io(server);
    socketHandling(io);
    server.listen(PORT, () => console.log(`Server — http://localhost:${PORT}`));
    return {io, app};
}


async function isAccessAllowed (accessToken: string): Promise<boolean> {
    if (!accessToken) return false;
    const base = await Database.get("Settings").findOrCreate("_id", "main");
    return (base.apiTokens || []).includes(accessToken);
}