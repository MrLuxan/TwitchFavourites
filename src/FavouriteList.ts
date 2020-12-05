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

    constructor(userName : string, isNewLayout : boolean)
    {
		super();
	
		this.UserName = userName;

			let listhtml : string = `[FavouriteList.html]`;

			this.DomElement = this.htmlToElement(listhtml);
			this.FavouriteList = this.DomElement.querySelector('#FavouriteList');


			let item : FavouriteItem = new FavouriteItem('Rob');

			this.FavouriteList.append(item.DomElement);



			console.log(this.FavouriteList);
		
	}
}