import { PostMessage,PostMessageCommand } from "./InterfacePostMessage";
import { Streamer } from "./Streamer";

declare var chrome : any;
export { };

export class PopupControler{

  Port : any;

	MessageReceived(msg : PostMessage)
	{
		console.log(msg);

		switch(msg.Command)
		{
			case PostMessageCommand.Setup:
        this.BuildListList(msg.FullList);
				break;
				
			case PostMessageCommand.Update:
				break;
	
			default:
				console.log("Unknown command");
				break;
		}
  }
  
  BuildListList(StreamList : Streamer[])
  {
    let pc = this;
    let online = StreamList.filter(streamer => streamer.Stream != null);

    (<HTMLElement>document.querySelector('#NoOneLive')).style.display = (online.length == 0 ? "block":"none");

    if(online.length > 0)
    {
      let liveList = document.querySelector('#Live');
      liveList.innerHTML = "";
    
      online.forEach(streamer => {
        liveList.innerHTML += this.BuildList(streamer);
      });
      
      document.querySelectorAll('.LiveItem').forEach(item => {
        (<HTMLElement>item).onclick = (event) =>{pc.LiveItemClick(event)};
      })
      
    }
  }

  LiveItemClick(e : Event)
  {
    let clickElement = <HTMLElement>e.target;
    let closestItem = <HTMLElement>clickElement.closest('.LiveItem');
    let streamerID = closestItem.dataset.id;
    chrome.tabs.create({url: `https://www.twitch.tv/${streamerID}`});
  }

  BuildList(streamer : Streamer) : string
  {
    return `<div data-id="${streamer.User.name}" class="LiveItem">
              <img class="LiveImg" src='${streamer.User.logo}'>
              <div class="LiveName">${streamer.User.display_name}</div>
              <div class="LiveGame">${streamer.Stream.game}</div>
              <div class="LiveCount">${streamer.Stream.viewers}</div>
            </div>`;
  }

  TabClick(e : any) {

    let cityName = e.srcElement.dataset.tabid;
  
    var i;
    var x = document.querySelectorAll('.container');
    for (i = 0; i < x.length; i++) {
      (<HTMLElement>x[i]).style.display = "none";  
    }
  
    let tabButtons = document.querySelectorAll('.tabButton');
    for (i = 0; i < tabButtons.length; i++) {
      tabButtons[i].className = tabButtons[i].className.replace(" tabButtonActive", "");
    }
  
    document.getElementById(cityName).style.display = "block";
    e.currentTarget.className += " tabButtonActive";
  }

  CheckBoxClick(e : any)
  {
    let checked = e.srcElement['custom-attr'] == true;
    if(checked){
      e.currentTarget.className = e.currentTarget.className.replace(" FakeCheckboxActive", "");
    }
    else{
      e.currentTarget.className += " FakeCheckboxActive";
    }
    e.srcElement['custom-attr'] = !checked;
    this.SettingChange(e.srcElement,!checked);
  }

  SettingChange(settingEle : any, value : any)
  {
    let setting = settingEle.dataset.setting;
  
    switch(setting)
    {
        case "DarkModeInPopup":
          let root = document.documentElement;
          let checked = value;
          if(checked){
            root.style.setProperty('--bg-color', '#1f1f23');
            root.style.setProperty('--text-color', '#fffef4');
          }
          else{
            root.style.setProperty('--bg-color', '#ffffff');
            root.style.setProperty('--text-color', '#0e0e10');
          }
  
          break;
    }
  
  } 

	constructor()
	{
    let pc = this;    
    let tabButtons = document.querySelectorAll('.tabButton');
    for (let i = 0; i < tabButtons.length; i++) {
      (<HTMLElement>tabButtons[i]).onclick = (event) =>{pc.TabClick(event)};
    }
  
    let fakeCheckboxs = document.querySelectorAll('.FakeCheckbox');
    for (let i = 0; i < fakeCheckboxs.length; i++) {
      (<HTMLElement>fakeCheckboxs[i]).onclick = (event) =>{pc.CheckBoxClick(event)};
    }

    this.Port = chrome.runtime.connect({name: "TwitchFavourites"});
		this.Port.onMessage.addListener(function(msg : PostMessage) {	
			pc.MessageReceived(msg);
		});
		this.Port.postMessage(<PostMessage>{Command : PostMessageCommand.Register});
  }

}

document.addEventListener('DOMContentLoaded', function () {
  new PopupControler();
});