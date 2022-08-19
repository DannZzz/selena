import Anime_Images from 'anime-images-api';
const API = new Anime_Images()

export type Endpoints = "hug" | "kiss" | "slap" | "wink" | "pat" | "kill" | "cuddle" | "punch" | "waifu";

export class AnimeGif {
    static async getLink(endpoint: Endpoints) {
        return (await API.sfw[endpoint]()).image;
    }
}