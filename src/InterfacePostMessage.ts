import { Settings } from "./InterfaceSettings";
import { Streamer } from "./Streamer";

export enum PostMessageCommand {
    Register,
    Unfavourited,
    Favourited,
    Update,
    Setup,
    SetttingsSave
}

export interface PostMessage
{
    Command: PostMessageCommand,
    Settings? : Settings
    FullList? : Array<Streamer>,
    OnlineList? : Array<Streamer>,
    DisplayList? : Array<Streamer>,
    Streamer? : Streamer,
    Port? : any,
    Time? : string
}