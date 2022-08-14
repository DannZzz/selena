import express from "express";
import http from "http";
import bodyParser from "body-parser";
import socketHandling from "./socketHandling";
import { PORT } from "../config";
import { Io } from "../structures/Io";
import Database from "../database/db";
import { Functions } from "../structures/Functions";
import { UserKeysApi } from "../database/models/User";
import { GuildKeysApi } from "../database/models/Guild";
import path from "path";
import { HeroId } from "../heroes/heroes-attr";
import { Levels } from "../custom-modules/Level-xp";
import { Heroes } from "../heroes/Heroes";

export function createApp () {
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
        const id = req.params.id;
        if (!id) return res.json({status: "Error", message: "Parameter id not specified."});
        const game = await Database.get("Game").findOne("_id", id);
        if (!game) return res.json({status: "Error", message: "Profile not found."});
        let data: {_id: string, nickname: string, xp: number, level: number, games: number, wins: number, heroes: Array<{heroId: HeroId, heroName: string, skin: string, avatarURL: string, games: number, wins: number}>} = {
            _id: game._id,
            nickname: game.nickname,
            xp: game.xp || 0,
            level: Levels.levelFor(game.xp || 0),
            games: game.games || 0,
            wins: game.wins || 0,
            heroes: Object.entries(game.heroes || {}).map(([heroId, mongoHero]) => {
                const hero = Heroes.find(heroId);
                const skin = Heroes.findSkin(heroId, mongoHero.skin)
                return {
                    avatarURL: hero.avatarURL(),
                    games: mongoHero.games || 0,
                    wins: mongoHero.wins || 0,
                    heroId: heroId as HeroId,
                    heroName: hero.name,
                    skin: skin.name
                }
            })
        }
        res.json({status: "Success", data});
    })
    
    app.use("/api/hero/avatar/", express.static(path.join(__dirname, `../../hero-images/`)))

    // connecting
    const server = http.createServer(app);
    const io = new Io(server);
    socketHandling(io);
    server.listen(PORT, () => console.log(`Server — http://localhost:${PORT}`));
    return {io, app};
}
