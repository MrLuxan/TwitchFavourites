import { UiElement } from "./UiElement";
import { DataStore } from "./DataStore"

import { ChannelData,Stream,Channel,Preview } from "./InterfaceStream";
import { User} from "./InterfaceUser";
import { FavouriteList } from "./FavouriteList";

declare var chrome: any;

export class FavouriteItem extends UiElement {

	List : FavouriteList;

	User : User;
	Stream : ChannelData;

	get ViewCount() : string
	{	
		if(this.Stream.stream == null)
			return 'Offile';
		else
		{
			if(this.Stream.stream.viewers > 1000)
				return (Math.round((this.Stream.stream.viewers / 1000) * 10) / 10).toString() + 'K';
			else
				return this.Stream.stream.viewers.toString();
		}
	}

	get Game() : string
	{
		if(this.Stream.stream == null)
			return '';
		else
		{
			return this.Stream.stream.game;
		}
	}

	ApiCall(url : string, callback : (response : string) => void) : void
	{
		let request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.setRequestHeader('Client-ID', 'qy39td8tqfejqgtatjoxyt3qlvr25j');
		request.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
		request.onload = function(){
			if (request.status >= 200 && request.status < 400) 
			{
				callback(request.responseText);
			}
		}
		request.send();		 
	} 


	SetStreamData(channelID: string, callBack: () => void) : void
	{
		let url = 'https://api.twitch.tv/kraken/streams/' + channelID;
		this.ApiCall(url,(response: string) =>{
			this.Stream = JSON.parse(response);
			callBack();
		});
	}

	SetUserData(channelID: string, callBack: () => void) : void
	{
		let url = 'https://api.twitch.tv/kraken/users/' + channelID;
		this.ApiCall(url,(response: string) =>{
			this.User = JSON.parse(response);
			callBack();
		});
	}


	Update() {
		if(this.User != null)
		{
			this.SetStreamData(this.User._id, () =>{
				let name = "HIHI";//this.User.display_name;
				let logo = this.User.logo;
				let game = "CODECODE";//this.Game;
				let viewers = "1";//this.ViewCount;

				let itemHtml : string = `[FavouriteItem.html]`;
				this.DomElement.outerHTML = itemHtml;
			});
		}
	}

    constructor(list : FavouriteList, ChannelID : string)
    {
		super();

		this.List = list;

		this.SetUserData(ChannelID, () => {
			this.SetStreamData(ChannelID, () =>{
				// do the ui

				let name = this.User.display_name;
				let logo = this.User.logo;
				let game = this.Game;
				let viewers = this.ViewCount;
	
				let itemHtml : string = `[FavouriteItem.html]`;
				this.DomElement = this.htmlToElement(itemHtml);
				this.List.FavouriteList.append(this.DomElement);
			})
		});
	}
}