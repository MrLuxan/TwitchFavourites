import { UiElement } from "./UiElement";
import { DataStore } from "./DataStore"


declare var chrome: any;

export class FavouriteList extends UiElement {

	UserName : string;

	ProfilePostit : HTMLTextAreaElement = null;
	EditButton : HTMLElement = null;
	SaveButton : HTMLElement = null;
	SettingsButton : HTMLElement = null;

    constructor(userName : string, isNewLayout : boolean)
    {
		super();
	
		this.UserName = userName;

			let FavouriteList : string = "";

			
			FavouriteList = `[FavouriteList.html]`;

			this.DomElement = this.htmlToElement(FavouriteList);

		
	}
}