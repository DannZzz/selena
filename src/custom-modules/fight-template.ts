import Canvas from "canvas";
import { AttachmentBuilder, BufferResolvable, ColorResolvable } from "discord.js";

export class FightTemplate {
    static async duel (f_url: string | BufferResolvable, s_url: string | BufferResolvable) {
        const c = await this.makeCanvas(f_url, s_url);
        return new AttachmentBuilder(c.toBuffer(), {name: "duel.jpg"})
    }

    static async list (options: {backgroundImage: string | BufferResolvable, borderColor?: ColorResolvable}, ...images: (string | BufferResolvable)[][]) {
        const length = images.reduce((all, arr) => all += arr.slice(0, 3).length, 0)
        let start = 25;
        const width = 300 * (length <= 3 ? length : 3);
        const height = 300 * Math.ceil(length / 3);
        const canvas = Canvas.createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage(options.backgroundImage);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        images.forEach((imageSrcs, row) => {
            imageSrcs.slice(0, 3).forEach(async (imageSrc, i) => {
                const image = await Canvas.loadImage(imageSrc);
                ctx.drawImage(image, start + i * 300, 25 + row * 300, 250, 250);
                ctx.lineWidth = 3;
                ctx.strokeStyle = options.borderColor as any || "#FDB416";
                ctx.strokeRect(start + i * 300, 25 + row * 300, 250, 250)
            })
        })
        return canvas; 
    }

    private static async makeCanvas (data1: string |  BufferResolvable, data2: string |  BufferResolvable) {
        const canvas = Canvas.createCanvas(1110, 520);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('https://i.ibb.co/SyjjcGt/vstemp.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
        const h = 280;
        const heroHeight = 120;
        const firstW = 80;
        const secW = 750;

        const first = await Canvas.loadImage(data1);
        const second = await Canvas.loadImage(data2);

        ctx.drawImage(first, firstW, heroHeight, h, h);
        ctx.drawImage(second, secW, heroHeight, h, h);

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#FDB416";
        ctx.strokeRect(firstW, heroHeight, h, h)

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#FDB416";
        ctx.strokeRect(secW, heroHeight, h, h)

        return canvas

        // const canvas = Canvas.createCanvas(1110, 520);
        // const ctx = canvas.getContext('2d');
        // const background = await Canvas.loadImage('https://png.pngtree.com/thumb_back/fh260/background/20200729/pngtree-game-battle-versus-vs-background-image_373230.jpg');
        // ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
        // const h = 300;
        // const heroHeight = 110;
        // const firstW = 60;
        // const secW = 750;
        
        // const first = await Canvas.loadImage(data1);
        // const second = await Canvas.loadImage(data2);
        
        // ctx.drawImage(first, firstW, heroHeight, h, h);
        // ctx.drawImage(second, secW, heroHeight, h, h);
      
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "GRAY";
        // ctx.strokeRect(firstW, heroHeight, h, h)
      
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "ORANGE";
        // ctx.strokeRect(secW, heroHeight, h, h)
        
        // return canvas
      }
}