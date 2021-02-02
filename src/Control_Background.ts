import { DataStore } from "./DataStore";
import { PostMessage, PostMessageCommand } from "./InterfacePostMessage";
import { Settings } from "./InterfaceSettings";
import { Streamer } from "./Streamer";
import { StreamerHub } from "./StreamerHub";
export { };

declare var chrome : any;

export class BackgroundControl{

  Settings : Settings = {
    ShowOffileChannelsInList : true,
    SortChannelBy : "A",
    ShowLiveNumber : true,
    DarkMode : false,
    ChannelsHigh : 6,
    ShowNotifcantoin : false
  };

  Hub : StreamerHub;
  Ports : any[] = [];

  LoadSettings() : Promise<any>
  {
    let bgC = this;

    return new Promise(function (resolve,reject){
      DataStore.DS.LoadData('settings')
      .then((savedSettings : Settings | null) =>{ 
        
        if(savedSettings != null)
        {
          bgC.Settings = savedSettings;
        }
        resolve(savedSettings);
      })
      .catch((error) =>{
        console.log('loaderror',error);
        reject(error);
      });
    });
  }

  SaveSettings() : Promise<any>
  {
    let bgC = this;

    console.log('Saveing',bgC.Settings);

    return new Promise(function (resolve){
      DataStore.DS.SaveData('settings',bgC.Settings)
      .then( ()=> {
        resolve(true);
       })
      .catch( ()=> {
        resolve(false);
       })
    });
  }

  StartStreamerHub() : Promise<any>
  {
    let bgC = this;

    return new Promise(function (resolve,reject){
      bgC.Hub = new StreamerHub(bgC.Settings);
      bgC.Hub.LoadStreamers().then((result) =>{
        resolve(result)
      }).catch((result)=>{
        result(result);
      });
    });
  }


  IssueListUpdate(){

    console.log("IssueListUpdate");

    let bgC = this;
    this.Ports.forEach(port => {
      port.postMessage(<PostMessage> {Command: PostMessageCommand.Update,
                                      FullList : bgC.Hub.Streamers,
                                      OnlineList : bgC.Hub.GetOnlineChannels(),
                                      DisplayList : bgC.Hub.GetDisplayList()});
    });
  }

  SetActionNumber()
  {
    if(this.Settings.ShowLiveNumber)
    {        
      let online : number = this.Hub.GetOnlineChannels().length;
      chrome.browserAction.setBadgeText({text: (online > 0 ? online.toString() : '')});
    }
    else{
      chrome.browserAction.setBadgeText({text: ''});
    }
  }

  NotifyNewlyOnline(refreshResult : Array<any>)
  {
    let bgC = this;

    if(this.Settings.ShowNotifcantoin)
    {
      refreshResult.forEach(element => {
        let streamer : Streamer = element[0];
        let newlyOnline = Boolean = element[1];

        console.log(streamer,newlyOnline);

        if(newlyOnline){
          bgC.Notify(streamer); 
        }
      });
    }
  }

  loadXHR(url : any) 
  {
    return new Promise(function(resolve, reject) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.onerror = function() {reject("Network error.")};
            xhr.onload = function() {
                if (xhr.status === 200) {resolve(xhr.response)}
                else {reject("Loading error:" + xhr.statusText)}
            };
            xhr.send();
        }
        catch(err) {reject(err.message)}
    });
  }
  
  Notify(streamer : Streamer) 
  {
    this.loadXHR(streamer.User.logo).then(function(blob : Blob) {        
      var options = {
          title: `Watch ${streamer.User.display_name} on Twitch`,
          message: `${streamer.User.display_name} has just gone live`,
          type: "basic",
          iconUrl: URL.createObjectURL(blob)
      };
  
      return chrome.notifications.create(streamer.User.name, options); // , callback );
    })
    .catch((error) => {console.log(error);})
  }

  Alarm(){
    console.log('Alram update');

    let bgC = this;

    this.Hub.Refresh()
    .then((res : Array<any>) =>{
      bgC.IssueListUpdate();
      bgC.NotifyNewlyOnline(res);
      bgC.SetActionNumber();
    })
    .catch((error) =>
    {
      console.error('error',error);
    });
  }

  TimeStamp() : string
  {
    let currentdate = new Date(); ;
    return currentdate.getHours() + ":"  
         + currentdate.getMinutes() + ":" 
         + currentdate.getSeconds();
  }
  
  NewPortConnect(port : any)
  {
    let bgC = this;

    port.onMessage.addListener(function(msg : PostMessage) {

      console.log(msg.Command,msg);
  
      switch(msg.Command)
      {
        case PostMessageCommand.Register:
          bgC.Ports.push(port);
          port.onDisconnect.addListener((p : any) =>{ bgC.Ports = bgC.Ports.filter(a => a != p); });
          port.postMessage(<PostMessage> {Command: PostMessageCommand.Setup,
                                          Settings : bgC.Settings,
                                          OnlineList : bgC.Hub.GetOnlineChannels(),
                                          FullList : bgC.Hub.Streamers,
                                          DisplayList : bgC.Hub.GetDisplayList()});
          break;
  
        case PostMessageCommand.Favourited:
          bgC.Hub.AddStreamer(msg.Streamer)
          .then((data) => {
            console.log(data)
            bgC.IssueListUpdate();
          })
          .catch((error) =>{
            console.log(error);
          });
          break;
        
        case PostMessageCommand.Unfavourited: 
          bgC.Hub.RemoveStreamer(msg.Streamer)
          .then((data) => {
            console.log(data)
            bgC.IssueListUpdate();
          })
          .catch((error) =>{
            console.log(error);
          });
          break;
  
        case PostMessageCommand.SetttingsSave:
          bgC.Settings = msg.Settings;
          bgC.SaveSettings().then(() => { 
            bgC.Hub.Settings = bgC.Settings;
            bgC.IssueListUpdate();
            bgC.SetActionNumber();
          });
          break;

        default:
          console.log('Unknown command', msg);
          break;
      }
    });
  }


  constructor()
	{
    let bgC = this;

    bgC.LoadSettings()
    .then(function() {
      console.log('Settings Loaded');
      return bgC.StartStreamerHub();
    }).then(function(result) {  
      console.log('Hub Loaded');
      //console.log(result);

      chrome.runtime.onConnect.addListener((port : any) => {
        bgC.NewPortConnect(port);
      });

      chrome.notifications.onClicked.addListener(function(notificationId : string) {  
        chrome.tabs.create({url: `https://www.twitch.tv/${notificationId}`});
      });

      chrome.alarms.onAlarm.addListener((alarm : any) => { bgC.Alarm() });
      chrome.alarms.create('refresh', { periodInMinutes: 1 });
      
      
    }).catch((error) =>{
      console.log('Load error');
      console.log(error);
    });
  }
}

new BackgroundControl();



/*




chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
  // create alarm after extension is installed / upgraded
  hub = new StreamerHub(null);
  hub.LoadStreamers();
  
});

chrome.runtime.onStartup.addListener(() => {
  console.log('onStartup...');
  hub = new StreamerHub(null);
  hub.LoadStreamers();
});



// chrome.tabs.onUpdated.addListener(function(tabId : any, info  : any, tab  : any) {

//   console.log(tabId,info,tab);

//   // if (info.url) {
//   //     chrome.tabs.sendMessage(tabId, {
//   //         message: 'urlChanged'
//   //     })
//   // }
// });

*/