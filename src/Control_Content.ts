import { Streamer } from "./Streamer";
import { FavouriteButton } from "./FavouriteButton";
import { FavouriteList } from "./FavouriteList";
import { PostMessage, PostMessageCommand } from "./InterfacePostMessage";
import { Settings } from "./InterfaceSettings";
import { browserAPI } from "./browserAPI";

export class ContentContol{

	FavList : FavouriteList = null;
	FavButton : FavouriteButton = null;
	
	FullList : Streamer[];
	DisplayList : Streamer[];
	Settings : Settings;	

	Port : any;

	LastUrl : string;

	MessageReceived(msg : PostMessage)
	{
		switch(msg.Command)
		{
			case PostMessageCommand.Setup:
				this.FullList = msg.FullList;
				this.DisplayList = msg.DisplayList;
				this.FavList = new FavouriteList(msg.DisplayList);
				break;
				
			case PostMessageCommand.Update:
				this.FullList = msg.FullList;
				this.DisplayList = msg.DisplayList;
				this.FavList.UpdateList(msg.DisplayList);
	
				if(this.FavButton != null){
					let favourited = msg.FullList.find(s => s.User.name == this.FavButton.ChannelName) != undefined;
					if(this.FavButton.Favourited != favourited)
					{
						this.FavButton.ExternalUpdate(favourited);
					}
				}
				break;
		}
	}

	CallbackAttributeChange()
	 {
		let newUrl = document.location.toString();

		if(newUrl != this.LastUrl)
		{
			let urlMatch = newUrl.match(/https?\:\/\/(?:www\.)?twitch\.tv\/(\d+|[A-Za-z0-9\.]+)\/?/);

			if(urlMatch != null)
			{
				let buttonContainer = document.querySelector('.follow-btn__notification-toggle-container');		
				if(buttonContainer != null) 
				{
					if(document.querySelector('.favouriteButton') == null)
					{
						this.FavButton = new FavouriteButton(this);
					}

					this.LastUrl = newUrl;
				}
			}
			else
			{
				this.LastUrl = newUrl;
			}
		}
	}

	constructor()
	{
		let cs = this;
		this.Port = browserAPI.runtime.connect({name: "TwitchFavourites"});
		this.Port.onMessage.addListener(function(msg : PostMessage) {	
			cs.MessageReceived(msg);
		});
		this.Port.postMessage(<PostMessage>{Command : PostMessageCommand.Register});

		var observer = new MutationObserver((mutations : any, mutationObs : any)=>{					
			this.CallbackAttributeChange();
		});
		let targetNode = document.querySelector('main');
		observer.observe(targetNode, {attributes: true, 
									  childList: true, 
									  characterData: true,
									  subtree: true});
	}
}

new ContentContol();