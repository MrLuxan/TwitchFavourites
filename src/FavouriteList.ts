import { UiElement } from "./UiElement";
import { FavouriteItem} from "./FavouriteItem";
import { Streamer } from './Streamer';

declare var chrome: any;
declare var ResizeObserver : any

export class FavouriteList extends UiElement {

	FavouriteList : HTMLElement = null; 
	FavouriteItems : FavouriteItem[] = [];

	BuildList(streamerList : Streamer[])
	{
		let listhtml : string = `[FavouriteList.html]`;
		let favlist = this.htmlToElement(listhtml);
		let list = favlist.querySelector('#FavouriteList');

		streamerList.forEach(streamer => {
			this.FavouriteItems.push(new FavouriteItem(this,list,streamer));
		});

		return favlist; 
	}

	UpdateList(streamerList : Streamer[])
	{
		let list = this.DomElement.querySelector('#FavouriteList');
		list.innerHTML = "";
		streamerList.forEach(streamer => {
			this.FavouriteItems.push(new FavouriteItem(this,list,streamer));
		});
	}

	ChangeSize()
	{
		if(this.DomElement != null)
		{
			let isWide = this.DomElement.offsetWidth > 100;

			let title = <HTMLElement>this.DomElement.querySelector('#FavouriteChannelsTitle');
			title.style.display = (isWide ? 'block' : 'none');
			
			let icon = <HTMLElement>this.DomElement.querySelector('#FavouriteChannelsIcon');
			icon.style.display = (isWide ? 'none' : 'block');
		}
	}	

    constructor(streamerList : Streamer[])
    {
		super();
		this.DomElement = this.BuildList(streamerList);

		let sidebar = document.querySelector('.side-bar-contents');
		let insetInto = sidebar.childNodes[0];
		insetInto.insertBefore(this.DomElement, insetInto.childNodes[0]);

		const ro = new ResizeObserver(() => {this.ChangeSize()});
		ro.observe(this.DomElement);
	}
}
