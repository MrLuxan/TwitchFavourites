import { UiElement } from "./UiElement";
import { DataStore } from "./DataStore"

import { FavouriteItem} from "./FavouriteItem";

declare var chrome: any;

export class FavouriteList extends UiElement {

	UserName : string;

	ProfilePostit : HTMLTextAreaElement = null;
	EditButton : HTMLElement = null;
	SaveButton : HTMLElement = null;
	SettingsButton : HTMLElement = null;

	FavouriteList : HTMLElement = null;

	FavouriteItems : FavouriteItem[] = [];

	UpdatePause : boolean = false;

	UpdateList()
	{
		console.log('update');
		console.log(this.FavouriteItems);
		console.log(this);

		if(!this.UpdatePause)
		{
			this.FavouriteItems.forEach(item => {
				item.Update();
			});
		}
	}

    constructor(userName : string, isNewLayout : boolean)
    {
		super();
	
		this.UserName = userName;

			let listhtml : string = `[FavouriteList.html]`;

			this.DomElement = this.htmlToElement(listhtml);
			this.FavouriteList = this.DomElement.querySelector('#FavouriteList');

			let ids = ['145622021','85875635','276657249','54808447'] 

			ids.forEach(id => {
				this.FavouriteItems.push(new FavouriteItem(this,id));
			});

			let timer = setInterval(() => {this.UpdateList()}, 1000 * 60 * 1);
	}
}