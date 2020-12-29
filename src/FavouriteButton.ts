import { UiElement } from "./UiElement";

declare var chrome: any;

export class FavouriteButton extends UiElement {


	Port : any = null;
	Popup : HTMLElement = null;
	Favourited : boolean = false;
	User : any = null;

	GetListElement() : HTMLElement
	{
		let itemHtml : string = `[FavouriteButton.html]`;
		return this.htmlToElement(itemHtml);
	}

	GetUserID() : object
	{
		return {_id : 111};
	}

	Click()
	{
		if(this.User == null)
			this.User = this.GetUserID();

		if(!this.Favourited)
		{
			this.Port.postMessage({Command : 'Favourited',
								   User : this.User});
		}
		else
		{
			this.Port.postMessage({Command : 'Unfavourited',
								   User : this.User});
		}

		this.Favourited = !this.Favourited;
		if(this.Popup != null)
		{
			let tooltip = this.Popup.querySelector('.tw-tooltip');
			tooltip.innerHTML = (!this.Favourited ? 'Favourite' : 'Unfavourite');
		}
	}

	ShowPopUp()
	{
		let message = (!this.Favourited ? 'Favourite' : 'Unfavourite');
		var rect = this.DomElement.getBoundingClientRect();
	
		let x = rect.left;
		let y = rect.top;

		let popupHtml = `[FavouriteButtonPopup.html]`;
		this.Popup = this.htmlToElement(popupHtml);

		let root = document.querySelector('#root');
		let addto = root.childNodes[0];
		addto.appendChild(this.Popup);
	}

	RemovePopup()
	{
		if(this.Popup != null)
		{
			this.Popup.remove();
			this.Popup = null;
		}	
	}

    constructor(port : any)
    {
		super();

		this.Port = port;

  		this.DomElement = this.GetListElement();      
    	let buttonContainer = document.querySelector('.follow-btn__follow-notify-container');
      	let addto = buttonContainer.childNodes[0];//.childNodes[0];
      	//console.log('addto',addto);
      	//console.log(addto.childNodes[0]);
		addto.insertBefore(this.DomElement,addto.childNodes[1]);
		  
		this.DomElement.onclick = () =>{this.Click()};
		this.DomElement.onmouseover = () =>{this.ShowPopUp()};
		this.DomElement.onmouseout = () =>{this.RemovePopup()};
	}
}