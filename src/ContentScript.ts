declare var chrome : any;

import { FavouriteList } from "./FavouriteList";

let FavList : FavouriteList = null;

let port = chrome.runtime.connect({name: "TwitchFavourites"});
port.onMessage.addListener(function(msg : any) {
	
  if(msg.StreamerList != null)
  {
	console.log(msg.Command,msg.StreamerList);

	if(FavList == null)
	{
		FavList = new FavouriteList(msg.StreamerList);

		let sidebar = document.querySelector('.side-bar-contents');
		let insetInto = sidebar.childNodes[0];
		insetInto.insertBefore(FavList.DomElement, insetInto.childNodes[0]);
	}
	else
	{
		FavList.UpdateList(msg.StreamerList)
	}
  }

  port.postMessage({Command : 'Register'});
});