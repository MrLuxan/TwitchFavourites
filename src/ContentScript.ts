declare var chrome : any;

import { FavouriteButton } from "./FavouriteButton";
import { FavouriteList } from "./FavouriteList";

let FavList : FavouriteList = null;

let port = chrome.runtime.connect({name: "TwitchFavourites"});
port.onMessage.addListener(function(msg : any) {
  if(msg.StreamerList != null)
  {
	if(FavList == null)
	{
		FavList = new FavouriteList(msg.StreamerList);
	}
	else
	{
		FavList.UpdateList(msg.StreamerList)
	}
  }
});
port.postMessage({Command : 'Register'});



let favouriteButton : FavouriteButton = null;

let observerConfig = {
	attributes: true, 
	childList: true, 
	characterData: true, 
	subtree: true
};
 

function callbackAttributeChange(mutations : any, mutationObs : any) {


	let buttonContainer = document.querySelector('.follow-btn__notification-toggle-container');

	if(buttonContainer != null && favouriteButton == null) 
	{
		console.log('loaded');
		favouriteButton = new FavouriteButton(port);
		console.log(favouriteButton.DomElement);
	}
}



var observer = new MutationObserver(callbackAttributeChange);
let targetNode = document.querySelector('.channel-info-content');
console.log(targetNode);
observer.observe(targetNode, observerConfig);



