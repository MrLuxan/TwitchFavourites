import { DataStore } from "./DataStore";
import { PostMessage, PostMessageCommand } from "./InterfacePostMessage";
import { Settings } from "./InterfaceSettings";
import { Streamer } from "./Streamer";
import { StreamerHub } from "./StreamerHub";
import { browserAPI } from "./browserAPI";
export { };

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
    return new Promise(function (resolve){
      DataStore.DS.SaveData('settings',bgC.Settings)
      .then(()=> {
        resolve(true);
       })
      .catch(()=> {
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
        reject(result);
      });
    });
  }

  IssueListUpdate(){
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
      browserAPI.browserAction.setBadgeText({text: (online > 0 ? online.toString() : '')});
    }
    else{
      browserAPI.browserAction.setBadgeText({text: ''});
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
  
      return browserAPI.notifications.create(streamer.User.name, options); // , callback );
    })
    .catch((error) => {console.log(error);})
  }

  Alarm()
  {
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
            bgC.IssueListUpdate();
            bgC.SetActionNumber();
          })
          .catch((error) =>{
            console.log(error);
          });
          break;
        
        case PostMessageCommand.Unfavourited: 
          bgC.Hub.RemoveStreamer(msg.Streamer)
          .then((data) => {
            bgC.IssueListUpdate();
            bgC.SetActionNumber();
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
      //console.log('Settings Loaded');
      return bgC.StartStreamerHub();
    }).then(function(result) {  
      //console.log('Hub Loaded',result);
      bgC.SetActionNumber();

      browserAPI.runtime.onConnect.addListener((port : any) => {
        bgC.NewPortConnect(port);
      });

      browserAPI.notifications.onClicked.addListener(function(notificationId : string) {  
        browserAPI.tabs.create({url: `https://www.twitch.tv/${notificationId}`});
      });

      browserAPI.alarms.onAlarm.addListener((alarm : any) => { bgC.Alarm() });
      browserAPI.alarms.create('refresh', { periodInMinutes: 2 });
    
    }).catch((error) =>{
      console.log('Load error',error);
    });
  }
}

new BackgroundControl();