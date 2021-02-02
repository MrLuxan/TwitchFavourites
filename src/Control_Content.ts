declare var chrome : any;

import { Streamer } from "./Streamer";
import { FavouriteButton } from "./FavouriteButton";
import { FavouriteList } from "./FavouriteList";
import { PostMessage, PostMessageCommand } from "./InterfacePostMessage";
import { Settings } from "./InterfaceSettings";


export class ContentContol{

	FavList : FavouriteList = null;
	FavButton : FavouriteButton = null;
	
	FullList : Streamer[];
	DisplayList : Streamer[];
	Settings : Settings;	

	Port : any;

	MessageReceived(msg : PostMessage)
	{
		console.log(msg);

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

				console.log(msg.DisplayList);

				this.FavList.UpdateList(msg.DisplayList);
	
				if(this.FavButton != null){
					let favourited = msg.FullList.find(s => s.User.name == this.FavButton.ChannelName) != undefined;
					if(this.FavButton.Favourited != favourited)
					{
						this.FavButton.ExternalUpdate(favourited);
					}
				}
				break;
	
			default:
				console.log("Unknown command");
				break;
		}
	}

	CallbackAttributeChange() {
		
		let buttonContainer = document.querySelector('.follow-btn__notification-toggle-container');
		if(buttonContainer != null && this.FavButton == null) 
		{
			this.FavButton = new FavouriteButton(this);
		}
	}


	constructor()
	{
		let cs = this;
		this.Port = chrome.runtime.connect({name: "TwitchFavourites"});
		this.Port.onMessage.addListener(function(msg : PostMessage) {	
			cs.MessageReceived(msg);
		});
		this.Port.postMessage(<PostMessage>{Command : PostMessageCommand.Register});

		var observer = new MutationObserver((mutations : any, mutationObs : any)=>{					
			this.CallbackAttributeChange();
		});
		let targetNode = document.querySelector('.channel-info-content');
		observer.observe(targetNode, {attributes: true, 
									  childList: true, 
									  characterData: true,
									  subtree: true});

	}
}

new ContentContol();