import { UiElement } from "./UiElement";
import { DataStore } from "./DataStore"

declare var chrome: any;

export class FavouriteItem extends UiElement {

	UserName : string;

	ProfilePostit : HTMLTextAreaElement = null;
	EditButton : HTMLElement = null;
	SaveButton : HTMLElement = null;
	SettingsButton : HTMLElement = null;

	FavouriteList : HTMLElement = null;

    constructor(userName : string)
    {
		super();
	
		this.UserName = userName;

			let itemHtml : string = `[FavouriteItem.html]`;
			this.DomElement = this.htmlToElement(itemHtml);
	}
}