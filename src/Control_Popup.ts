
import { PostMessage,PostMessageCommand } from "./InterfacePostMessage";
import { Settings } from "./InterfaceSettings";
import { Streamer } from "./Streamer";
import { browserAPI } from "./browserAPI";

export { };

export class PopupControl{

  Port : any;
  Settings : Settings;
  OnlineList : Array<Streamer>

	MessageReceived(msg : PostMessage)
	{
		switch(msg.Command)
		{
			case PostMessageCommand.Setup:
        this.Settings = msg.Settings;
        this.OnlineList = msg.OnlineList;
        this.BuildListList();
        this.SetSettings();
				break;
				
			case PostMessageCommand.Update:
        this.OnlineList = msg.OnlineList;
        this.BuildListList();
				break;
	
			default:
				console.log("Unknown command");
				break;
		}
  }
  
  BuildListList()
  {
    let pc = this;

    if(this.OnlineList.length > 0)
    {
      (<HTMLElement>document.querySelector('#NoOneLive')).style.display = "none";

      let liveList : HTMLElement = document.querySelector('#Live');
      liveList.innerHTML = "";
    
      this.OnlineList.forEach(streamer => {
        liveList.innerHTML += this.BuildList(streamer);
      });
      
      document.querySelectorAll('.LiveItem').forEach(item => {
        (<HTMLElement>item).onclick = (event) =>{pc.LiveItemClick(event)};
      })

      if(this.OnlineList.length > this.Settings.ChannelsHigh)
      {
        let itemHight = 50;
        liveList.style.maxHeight = (itemHight * this.Settings.ChannelsHigh).toString() + "px";
        liveList.style.overflowY = "scroll";
      }else{
        liveList.style.maxHeight = "none";
        liveList.style.overflowY = "visable";
      }
    }
    else{
      (<HTMLElement>document.querySelector('#NoOneLive')).style.display = "block";
    }
  }

  RemoveClass(ele : HTMLElement ,  className : string)
  {
    ele.className = ele.className.replace(className, "");
  }

  AddClass(ele : HTMLElement ,  className : string)
  {
    ele.className += className;
  }

  SetSettings()
  { 

    let ele;

    if(!this.Settings.ShowOffileChannelsInList){
        ele = document.querySelector('[data-setting="ShowOfflineChannels"]');
        ele.className = ele.className.replace(" FakeCheckboxActive", "");
    }

    if(this.Settings.SortChannelBy == "N")
    {
      ele = document.querySelector('[data-setting="Alphabetically"]');
      ele.className = ele.className.replace(" FakeCheckboxActive", "");

      document.querySelector('[data-setting="ByViewCount"]').className += " FakeCheckboxActive";
    }

    if(!this.Settings.ShowLiveNumber){
      ele = document.querySelector('[data-setting="ShowLiveNumber"]');
      ele.className = ele.className.replace(" FakeCheckboxActive", "");
    }

    if(this.Settings.DarkMode){
      document.querySelector('[data-setting="DarkModeInPopup"]').className += " FakeCheckboxActive";      
      this.SetDarkMode(true);
    }

    (<HTMLInputElement>document.querySelector('[data-setting="ChannelsHigh"]')).value = this.Settings.ChannelsHigh.toString();
    
    if(this.Settings.ShowNotifcantoin){
      document.querySelector('[data-setting="ShowAlerts"]').className += " FakeCheckboxActive";      
    }
  }

  SetDarkMode(darkMode : boolean)
  {
    let root = document.documentElement;
    if(darkMode){
      root.style.setProperty('--bg-color', '#1f1f23');
      root.style.setProperty('--text-color', '#fffef4');
    }
    else{
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--text-color', '#0e0e10');
    }
  }

  SaveSettings()
  {
    this.Port.postMessage(<PostMessage>{Command : PostMessageCommand.SetttingsSave,
                                        Settings : this.Settings});
  }

  LiveItemClick(e : Event)
  {
    let clickElement = <HTMLElement>e.target;
    let closestItem = <HTMLElement>clickElement.closest('.LiveItem');
    let streamerID = closestItem.dataset.id;
    browserAPI.tabs.create({url: `https://www.twitch.tv/${streamerID}`});
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

    let tabName = e.srcElement.dataset.tabid;
  
    var i;
    var x = document.querySelectorAll('.container');
    for (i = 0; i < x.length; i++) {
      (<HTMLElement>x[i]).style.display = "none";  
    }
  
    let tabButtons = document.querySelectorAll('.tabButton');
    for (i = 0; i < tabButtons.length; i++) {
      tabButtons[i].className = tabButtons[i].className.replace(" tabButtonActive", "");
    }
  
    document.getElementById(tabName).style.display = "block";
    e.currentTarget.className += " tabButtonActive";
  }

  CheckBoxClick(e : any)
  {
    if(e.srcElement.classList.contains("FakeRadio"))
    {
      let parent  = e.srcElement.closest('.SetttingsSubCat')
      let items : Array<HTMLElement> = parent.querySelectorAll('.FakeRadio');
      items.forEach(item => {
        item.className = item.className.replace(" FakeCheckboxActive", "");
      });
    }

    let checked = e.srcElement.classList.contains('FakeCheckboxActive');
    if(checked){
      e.currentTarget.className = e.currentTarget.className.replace(" FakeCheckboxActive", "");
    }
    else{
      e.currentTarget.className += " FakeCheckboxActive";
    }

    this.SettingChange(e.srcElement,!checked);
  }

  NumberChange(e : Event)
  {
    let input = <HTMLInputElement>e.target;
    let val = parseInt(input.value);
    let max = parseInt(input.max);
    let min = parseInt(input.min);

    if(val > max){
      val = max;
      input.value = input.max;
    } else if(val < min){
      val = min;
      input.value = input.value;
    }

    this.SettingChange(input, val);
  }

  SettingChange(settingEle : any, value : boolean | number)
  {
    let setting = settingEle.dataset.setting;
  
    switch(setting)
    {
        case "ShowOfflineChannels":
          this.Settings.ShowOffileChannelsInList = <boolean>value;
          break;

        case "Alphabetically":
          this.Settings.SortChannelBy = "A";
          break;

        case "ByViewCount":
          this.Settings.SortChannelBy = "N";
          break;

        case "ShowLiveNumber":
          this.Settings.ShowLiveNumber = <boolean>value;
          break;

        case "DarkModeInPopup":          
          let checked = <boolean>value;        
          this.Settings.DarkMode = checked;
          this.SetDarkMode(checked);    
          break;

        case "ChannelsHigh":
          this.Settings.ChannelsHigh = <number>value;
          this.BuildListList();
          break;

        case "ShowAlerts":
          this.Settings.ShowNotifcantoin = <boolean>value;
          break;
    }

    this.SaveSettings();
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
      (<HTMLElement>fakeCheckboxs[i]).onclick = (event) => {pc.CheckBoxClick(event)};
    }

    let numberInput = <HTMLInputElement>document.querySelector('.NumberInput');
    numberInput.onchange = (event) => { pc.NumberChange(event) };


    this.Port = browserAPI.runtime.connect({name: "TwitchFavourites"});
		this.Port.onMessage.addListener(function(msg : PostMessage) {	
			pc.MessageReceived(msg);
		});
		this.Port.postMessage(<PostMessage>{Command : PostMessageCommand.Register});
  }

}

document.addEventListener('DOMContentLoaded', function () {
  new PopupControl();
});