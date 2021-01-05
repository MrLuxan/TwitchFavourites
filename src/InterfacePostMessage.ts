import { Streamer } from "./Streamer";

export enum PostMessageCommand {
    Register,
    Unfavourited,
    Favourited,
    Update,
    Setup
}

export interface PostMessage
{
    Command: PostMessageCommand,
    FullList? : Array<Streamer>,
    DisplayList? : Array<Streamer>,
    Streamer? : Streamer,
    Port? : any
    Time? : string
}