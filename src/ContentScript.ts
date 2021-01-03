declare var chrome : any;

import { Streamer } from "./Streamer";
import { FavouriteButton } from "./FavouriteButton";
import { FavouriteList } from "./FavouriteList";

let FavList : FavouriteList = null;
let FavButton : FavouriteButton = null;

let port = chrome.runtime.connect({name: "TwitchFavourites"});
port.onMessage.addListener(function(msg : any) {
  if(msg.StreamerList != null)
  {
	let list : Array<Streamer> = msg.StreamerList;

	if(FavList == null) {
		FavList = new FavouriteList(list);
	}
	else {
		FavList.UpdateList(list)
	}

	if(FavButton != null){
		let favourited = list.find(s => s.User.name == FavButton.ChannelName) != undefined;
		if(FavButton.Favourited != favourited)
		{
			FavButton.ExternalUpdate(favourited);	
		}
	}
  }
});
port.postMessage({Command : 'Register'});


let observerConfig = {
	attributes: true, 
	childList: true, 
	characterData: true, 
	subtree: true
};
 

function callbackAttributeChange(mutations : any, mutationObs : any) {

	let buttonContainer = document.querySelector('.follow-btn__notification-toggle-container');

	if(buttonContainer != null && FavButton == null) 
	{
		console.log('loaded');
		FavButton = new FavouriteButton(port);
		console.log(FavButton.DomElement);
	}
}



var observer = new MutationObserver(callbackAttributeChange);
let targetNode = document.querySelector('.channel-info-content');
console.log(targetNode);
observer.observe(targetNode, observerConfig);



