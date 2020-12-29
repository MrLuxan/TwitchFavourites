import { UiElement } from "./UiElement";

import { FavouriteList } from "./FavouriteList";
import { Streamer } from "./Streamer";

declare var chrome: any;

export class FavouriteItem extends UiElement {

	Streamer : Streamer;
	List : FavouriteList;

	k : number = 1;

	get ViewCount() : string
	{	
		if(this.Streamer.Stream == null)
			return 'Offile';
		else
		{
			if(this.Streamer.Stream.viewers > 1000)
				return (Math.round((this.Streamer.Stream.viewers / 1000) * 10) / 10).toString() + 'K';
			else
				return this.Streamer.Stream.viewers.toString();
		}
	}

	get Game() : string
	{
		return(this.Streamer.Stream == null ? '' :this.Streamer.Stream.game);
	}

	Update(streamer : Streamer) {
		this.Streamer = streamer;
		this.DomElement.innerHTML = this.GetListElement().innerHTML;
	}

	GetListElement() : HTMLElement
	{
		let name = this.Streamer.User.display_name;
		let logo = this.Streamer.User.logo;
		let game = this.Game;
		let viewers = this.ViewCount;
		let imageClass = 'side-nav-card__avatar' + (this.Streamer.Stream == null ? '--offline' : '');
		let onlinetext = (this.Streamer.Stream == null ? 'style="display:none"' : '');
		let offlinetext = (this.Streamer.Stream == null ? '' : 'style="display:none"');

		let itemHtml : string = `[FavouriteItem.html]`;
		return this.htmlToElement(itemHtml);
	}

    constructor(favList : FavouriteList, list : Element, streamer : Streamer)
    {
		super();
	
		this.Streamer = streamer;
		this.List = favList;
		this.DomElement = this.GetListElement();
		list.append(this.DomElement);
	}
}