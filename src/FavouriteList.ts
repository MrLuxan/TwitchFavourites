import { UiElement } from "./UiElement";
import { FavouriteItem} from "./FavouriteItem";
import { Streamer } from './Streamer';

declare var chrome: any;
declare var ResizeObserver : any

export class FavouriteList extends UiElement {

	FavouriteList : HTMLElement = null; 
	FavouriteItems : FavouriteItem[] = [];

	SideBarTooltip : HTMLElement = null;

	BuildList(streamerList : Streamer[])
	{
		let listhtml : string = `[FavouriteList.html]`;
		this.DomElement = this.htmlToElement(listhtml);

		this.UpdateList(streamerList)
	}

	TitleIconMouseEnter(event : any)
	{
		let icon = this.DomElement.querySelector('figure');
		var rect = icon.getBoundingClientRect();		
		let ypos : number = rect.top;

		let tooltipHtml = `[SideBarIconTooltip.html]`;
		this.SideBarTooltip = this.htmlToElement(tooltipHtml);
		document.body.append(this.SideBarTooltip);
	};

	TitleIconMouseLeave(event : any)
	{
		this.SideBarTooltip.remove();
	};

	StreamerMouseEnter(event : any)
	{
		let DisplayName : string = '' ;
		let Game : string = '' ;
		let Bio : string = '' ;
		let ViewCount : string = '' ;

		let tooltipHtml = `[SideBarOnlineTooltip.html]`;
		this.SideBarTooltip = this.htmlToElement(tooltipHtml);
		document.body.append(this.SideBarTooltip);
	}

	StreamerMouseLeave(event : any)
	{
		this.SideBarTooltip.remove();
	}


	UpdateList(streamerList : Streamer[])
	{
		let list = this.DomElement.querySelector('#FavouriteList');
		list.innerHTML = "";

		this.FavouriteItems = [];
		streamerList.forEach(streamer => {
			this.FavouriteItems.push(new FavouriteItem(this,list,streamer));
		});
		
		let isWide = this.DomElement.offsetWidth > 100;				
		let farouriteMessage = <HTMLElement>this.DomElement.querySelector('#NoFavouriteMessage');
		farouriteMessage.style.display = (isWide && this.FavouriteItems.length == 0 ? 'block' : 'none');
	}

	ChangeSize()
	{
		if(this.DomElement != null)
		{
			let isWide = this.DomElement.offsetWidth > 100;

			let title = <HTMLElement>this.DomElement.querySelector('#FavouriteChannelsTitle');
			title.style.display = (isWide ? 'block' : 'none');

			let farouriteMessage = <HTMLElement>this.DomElement.querySelector('#NoFavouriteMessage');
			farouriteMessage.style.display = (isWide && this.FavouriteItems.length == 0 ? 'block' : 'none');
			
			let icon = <HTMLElement>this.DomElement.querySelector('#FavouriteChannelsIcon');
			icon.style.display = (isWide ? 'none' : 'block');
		}
	}
	
	

    constructor(streamerList : Streamer[])
    {
		super();
		this.BuildList(streamerList);

		let sidebar = document.querySelector('.side-bar-contents');
		let insetInto = sidebar.childNodes[0];
		insetInto.insertBefore(this.DomElement, insetInto.childNodes[0]);

		let icon = this.DomElement.querySelector('figure');
		icon.onmouseenter = (event) =>{this.TitleIconMouseEnter(event)};
		icon.onmouseleave = (event) =>{this.TitleIconMouseLeave(event)};
		
		const ro = new ResizeObserver(() => {this.ChangeSize()});
		ro.observe(this.DomElement);
	}
}
