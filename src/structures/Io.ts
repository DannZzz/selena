import {Server, Socket} from "socket.io";
import {Server as HttpServer} from "http";


export class Io {
    private listeners: {ev: string, callback: (socketId: string, ...data: any[]) => any}[] = [];
    readonly _server: Server
    constructor(httpServer: HttpServer) {
        this._server = new Server(httpServer, {"allowEIO3": true});
        this._server.on("connection", socket => {
            socket.onAny((ev, ...args) => {
                const event = this.listeners.find(x => x.ev === ev);
                event && event.callback(socket.id, ...args)
            })
        })
    }

    /**
     * Emit to all sockets
     * @param ev event name
     * @param args arguments
     */
    emitAll(ev: string, ...args: any[]) {
        this._server.emit(ev, ...args);
    }

    /**
     * Emit to one socket by id
     * @param socketId socket's id
     * @param ev event name
     * @param args arguments
     */
    emitOne(socketId: string, ev: string, ...args: any[]) {
        this._server.sockets.sockets.get(socketId).emit(ev, ...args)
    }

    /**
     * On socket data received
     * @param ev event name
     * @param callback callback fn
     */
    on(ev: string, callback: (socketId: string, ...data: any[]) => any) {
        this.listeners.push({ev, callback})
    }
}
