import { UiElement } from "./UiElement";
import { FavouriteItem} from "./FavouriteItem";
import { Streamer } from './Streamer';

declare var chrome: any;

export class FavouriteList extends UiElement {

	UserName : string;

	ProfilePostit : HTMLTextAreaElement = null;
	EditButton : HTMLElement = null;
	SaveButton : HTMLElement = null;
	SettingsButton : HTMLElement = null;

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
		this.DomElement.innerHTML = this.BuildList(streamerList).innerHTML;
	}

    constructor(streamerList : Streamer[])
    {
		super();
		this.DomElement = this.BuildList(streamerList);
	}
}