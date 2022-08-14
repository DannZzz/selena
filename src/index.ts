import express from 'express';
import path from "path";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import { PORT } from './config';
// mongodb connection
import connection from './database/connection';
import discordOauthFunction from './routers/discordOauthFunction';
import socketHandler from './handlers/socketHandler';
import profileRouter from './routers/profile';
connection()

var urlencodedParser = bodyParser.urlencoded({ extended: false })  


const paths = {
    chat: path.resolve("./public/chat"),
    auth: path.resolve("./public/auth"),
    reset: path.resolve("./public/get-code"),
    enterMail: path.resolve("./public/enter-email"),
    profile: path.resolve("./public/profile")
}

const app = express();


app.get("/", (req, res) => {
    res.redirect(301, "/chat")
})

app.use(bodyParser.json());

app.use("/enter-email", express.static(paths.enterMail))

app.use("/get-code", express.static(paths.reset))

app.use("/chat", express.static(paths.chat))

app.use("/auth", express.static(paths.auth))
app.get("/auth/discord", urlencodedParser, discordOauthFunction)

app.use("/profile", profileRouter);

const server = http.createServer(app);
const io = new Server(server, {"allowEIO3": true});

io.on("connection", (socket) => socketHandler(io, socket));

server.listen(PORT, () => {
    console.log("Server is listening to http://localhost:" + PORT)
})
