import { UiElement } from "./UiElement";
import { FavouriteList } from "./FavouriteList";
import { Streamer } from "./Streamer";

declare var chrome: any;

export class FavouriteItem extends UiElement {

	Streamer : Streamer;
	List : FavouriteList;

	Tooltip : HTMLElement;

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

	MouseEnter(event : any)
	{
		let isWide = this.DomElement.offsetWidth > 100;

		console.log(isWide);

		if(!isWide)
		{
			var rect = this.DomElement.getBoundingClientRect();		
			let ypos : number = rect.top;

			if(this.Streamer.Stream != null)
			{
				let displayName : string = this.Streamer.User.display_name;
				let game : string = this.Streamer.Stream.game;
				let bio : string = this.Streamer.Stream.channel.status;
				let viewCount : string = this.ViewCount ; 

				let tooltipHtml = `[SideBarOnlineTooltip.html]`;
				this.Tooltip = this.htmlToElement(tooltipHtml);
				document.body.append(this.Tooltip);
			}
			else
			{
				let channelName : string = this.Streamer.User.name;
				let displayName : string = this.Streamer.User.display_name;
				let tooltipHtml = `[SideBarOfflineTooltip.html]`;
				this.Tooltip = this.htmlToElement(tooltipHtml);
				document.body.append(this.Tooltip);
			}

			console.log(this.Tooltip);
		}
	}

	MouseLeave(event : any)
	{
		if(this.Tooltip != null){
			this.Tooltip.remove();
		}
	}

	Update(streamer : Streamer) {
		this.Streamer = streamer;
		this.DomElement.innerHTML = this.GetListElement().innerHTML;
	}

	GetListElement() : HTMLElement
	{
		let displayName = this.Streamer.User.display_name;
		let channelName = this.Streamer.User.name;
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
		this.DomElement.onmouseenter = (event) =>{this.MouseEnter(event)};
		this.DomElement.onmouseleave = (event) =>{this.MouseLeave(event)};
		list.append(this.DomElement);
	}
}