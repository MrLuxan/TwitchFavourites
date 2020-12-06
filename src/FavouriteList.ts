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

		console.log(this.FavouriteItems);

		if(!this.UpdatePause)
		{
			this.FavouriteItems.forEach(element => {
				element.Update();
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


			this.FavouriteItems.push(new FavouriteItem(this,'85875635'));
			this.FavouriteItems.push(new FavouriteItem(this,'276657249'));
			this.FavouriteItems.push(new FavouriteItem(this,'145622021'));


			console.log(this.FavouriteItems);

			let timer = setInterval(this.UpdateList, 1000 * 60 * 2);

			//let item2 : FavouriteItem = new FavouriteItem('Rob2');
			//this.FavouriteList.append(item2.DomElement);

			//item2.Update();
	}
}