import { PostMessage, PostMessageCommand } from "./InterfacePostMessage";
import { Streamer } from "./Streamer";
import { UiElement } from "./UiElement";

declare var chrome: any;

export class FavouriteButton extends UiElement {

	ChannelName : string = null;

	Port : any = null;
	Popup : HTMLElement = null;
	Favourited : boolean = false;
	ChannelStreamer : Streamer = null;

	MouseOver : boolean = false;

	BuildButton() : HTMLElement
	{
		let iconHtml : string = `[FavouriteButtonSvg.html]`;
		let iconfilledHtml : string = `[FavouriteButtonSvgFilled.html]`;
		let buttonHtml : string = `[FavouriteButton.html]`;

		let button : HTMLElement = this.htmlToElement(buttonHtml);
		let icon : HTMLElement = this.htmlToElement((!this.Favourited ? iconHtml : iconfilledHtml));
		button.querySelector('figure').append(icon);

		return button;
	}

	GetStreamer() : Promise<any>
	{
		let button = this;
		return new Promise(function(resolve,reject){

			if(button.ChannelStreamer == null)
			{
				let steamer = new Streamer();
				steamer.SetUserByName(button.ChannelName)
				.then(()=>{
					button.ChannelStreamer = steamer;
					resolve(steamer);
				})
				.catch((error)=>{
					console.log(error);
				});
			}
			else
			{
				resolve(button.ChannelStreamer);
			}
		});
	}

	Click()
	{
		let button = this;
		this.GetStreamer()
		.then((streamer : Streamer) =>{

			let viewcountEle = document.querySelector('[data-a-target="animated-channel-viewers-count"]');
			if(viewcountEle != null)
			{
				let numberel = <HTMLElement>(viewcountEle.childNodes.length == 1 ? viewcountEle : viewcountEle.childNodes[0]);
				let viewcount : number = parseInt(numberel.innerText.replace(/,/g, ''));
				let gameplayed : string = (<HTMLElement>document.querySelector('[data-a-target="stream-game-link"]').childNodes[0]).innerText;
	
				streamer.Stream = {viewers : viewcount, game : gameplayed };	
			}
			button.Port.postMessage(<PostMessage> {Command : (!button.Favourited ? PostMessageCommand.Favourited :
																				   PostMessageCommand.Unfavourited),
									 			   Streamer : streamer});
	
			this.Favourited = !this.Favourited;
			if(this.Popup != null)
			{
				let tooltip = this.Popup.querySelector('.tw-tooltip');
				tooltip.innerHTML = (!this.Favourited ? 'Favourite' : 'Unfavourite');
			}
	
			let iconSlot = this.DomElement.querySelector('figure');
	
			if(!this.Favourited)
			{
				let iconHtml : string = `[FavouriteButtonSvg.html]`;
				let icon : HTMLElement = this.htmlToElement(iconHtml);
				iconSlot.innerHTML = "";
				iconSlot.append(icon);
			}
		})
		.catch((error) => {
			console.log(error);
		})
	}

	MouseEnter(event : any)
	{		
		if(this.MouseOver) // Stop multiple triggers on when changing icon on unfavourting
			return;

		this.MouseOver = true;

		var rect = this.DomElement.getBoundingClientRect();
		let x = rect.left;
		let y = rect.top;
		let message = (!this.Favourited ? 'Favourite' : 'Unfavourite');
		let popupHtml = `[FavouriteButtonPopup.html]`;
		this.Popup = this.htmlToElement(popupHtml);
		let root = document.querySelector('#root');
		let addto = root.childNodes[0];
		addto.appendChild(this.Popup);
		
		let animate : HTMLElement = this.DomElement.querySelector(".tw-mg-r-0");
		animate.style.cssText = 'transform: translateX(0px) scale(1.2); transition: transform 300ms ease 0s';

		
		let iconSlot = this.DomElement.querySelector('figure');

		if(!this.Favourited)
		{
			let iconfilledHtml : string = `[FavouriteButtonSvgFilled.html]`;
			let icon : HTMLElement = this.htmlToElement(iconfilledHtml);
			iconSlot.innerHTML = "";
			iconSlot.append(icon);
		}
	}

	MouseLeave(event : any)
	{
		let animate : HTMLElement = this.DomElement.querySelector(".tw-mg-r-0");
		animate.style.cssText = 'transform: translateX(0px) scale(1); transition: transform 300ms ease 0s;';
		
		if(this.Popup != null)
		{
			this.Popup.remove();
			this.Popup = null;
		}	

		let iconSlot = this.DomElement.querySelector('figure');

		if(!this.Favourited)
		{
			let iconHtml : string = `[FavouriteButtonSvg.html]`;
			let icon : HTMLElement = this.htmlToElement(iconHtml);
			iconSlot.innerHTML = "";
			iconSlot.append(icon);
		}

		this.MouseOver = false;
	}

	ExternalUpdate(favourited : boolean)
	{
		this.Favourited = favourited;

		let iconHtml : string;
		if(this.Favourited) {
			iconHtml = `[FavouriteButtonSvgFilled.html]`;
		}
		else {
			iconHtml = `[FavouriteButtonSvg.html]`;
		}

		let iconSlot = this.DomElement.querySelector('figure');
		let icon : HTMLElement = this.htmlToElement(iconHtml);
		iconSlot.innerHTML = "";
		iconSlot.append(icon);
	}

    constructor(port : any)
    {
		super();

		this.Port = port;

		this.ChannelName  = (<HTMLElement>document.querySelector('.channel-info-content')
							.querySelector('a'))
							.getAttribute('href')
							.replace(/\//g,'');

  		this.DomElement = this.BuildButton();      
    	let buttonContainer = document.querySelector('.follow-btn__follow-notify-container');
      	let addto = buttonContainer.childNodes[0];
		addto.insertBefore(this.DomElement,addto.childNodes[1]);
		  
		this.DomElement.onclick = () =>{this.Click()};
		this.DomElement.onmouseenter = (event) =>{this.MouseEnter(event)};
		this.DomElement.onmouseleave = (event) =>{this.MouseLeave(event)};
	}
}