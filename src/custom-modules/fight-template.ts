import Canvas from "canvas";
import { AttachmentBuilder, BufferResolvable } from "discord.js";

export class FightTemplate {
    static async duel (f_url: string | BufferResolvable, s_url: string | BufferResolvable) {
        const c = await this.makeCanvas(f_url, s_url);
        return new AttachmentBuilder(c.toBuffer(), {name: "duel.jpg"})
    }

    private static async makeCanvas (data1: string |  BufferResolvable, data2: string |  BufferResolvable) {
        const canvas = Canvas.createCanvas(1110, 520);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('https://png.pngtree.com/thumb_back/fh260/background/20200729/pngtree-game-battle-versus-vs-background-image_373230.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
        const h = 300;
        const heroHeight = 110;
        const firstW = 60;
        const secW = 750;
        
        const first = await Canvas.loadImage(data1);
        const second = await Canvas.loadImage(data2);
        
        ctx.drawImage(first, firstW, heroHeight, h, h);
        ctx.drawImage(second, secW, heroHeight, h, h);
      
        ctx.lineWidth = 3;
        ctx.strokeStyle = "GRAY";
        ctx.strokeRect(firstW, heroHeight, h, h)
      
        ctx.lineWidth = 3;
        ctx.strokeStyle = "ORANGE";
        ctx.strokeRect(secW, heroHeight, h, h)
        
        return canvas
      }
}