import { PostMessage, PostMessageCommand } from "./InterfacePostMessage";
import { StreamerHub } from "./StreamerHub";
export { };

declare var chrome : any;
let RefreshEnabled = false;


let hub : StreamerHub;
let Ports : any[] = [];

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
  // create alarm after extension is installed / upgraded
  hub = new StreamerHub();
  hub.LoadStreamers();
  chrome.alarms.create('refresh', { periodInMinutes: 1 });
});

chrome.runtime.onStartup.addListener(() => {
  console.log('onStartup...');
  hub = new StreamerHub();
  hub.LoadStreamers();
});

function TimeStamp()
{
  let currentdate = new Date(); ;
  return currentdate.getHours() + ":"  
       + currentdate.getMinutes() + ":" 
       + currentdate.getSeconds();
}

chrome.alarms.onAlarm.addListener((alarm : any) => {
  if(RefreshEnabled){
    hub.Refresh()
    .then(() =>{
      IssueListUp();
      })
  }
  else
  {
    IssueListUp();
  }
  //console.log(alarm.name); // refresh  
});

function IssueListUp(){
  let time = TimeStamp();




  console.log(time);
  Ports.forEach(port => {
    port.postMessage(<PostMessage> {Command: PostMessageCommand.Update,
                                    FullList : hub.Streamers,
                                    DisplayList : hub.GetList(),                  
                                    Time : time});
  });
}


chrome.runtime.onConnect.addListener((port : any) => {
  port.onMessage.addListener(function(msg : PostMessage) {

    console.log(msg);

    switch(msg.Command)
    {
      case PostMessageCommand.Register:
        Ports.push(port);
        port.onDisconnect.addListener((p : any) =>{ Ports = Ports.filter(a => a != p); });
        port.postMessage(<PostMessage> {Command: PostMessageCommand.Setup,
                                        FullList : hub.Streamers,
                                        DisplayList : hub.GetList()});
        break;

      case PostMessageCommand.Favourited:
        hub.AddStreamer(msg.Streamer)
        .then((data) => {
          console.log(data)
          IssueListUp();
        })
        .catch((error) =>{
          console.log(error);
        });
        break;
      
      case PostMessageCommand.Unfavourited: 
        hub.RemoveStreamer(msg.Streamer)
        .then((data) => {
          console.log(data)
          IssueListUp();
        })
        .catch((error) =>{
          console.log(error);
        });
        break;

      default:
        console.log('Unknown command', msg);
        break;
    }
  });
});


// loadXHR(url : any) {

//   return new Promise(function(resolve, reject) {
//       try {
//           var xhr = new XMLHttpRequest();
//           xhr.open("GET", url);
//           xhr.responseType = "blob";
//           xhr.onerror = function() {reject("Network error.")};
//           xhr.onload = function() {
//               if (xhr.status === 200) {resolve(xhr.response)}
//               else {reject("Loading error:" + xhr.statusText)}
//           };
//           xhr.send();
//       }
//       catch(err) {reject(err.message)}
//   });
// }



// Notify(streamer : Streamer) 
// {
//   this.loadXHR(streamer.User.logo).then(function(blob) {        
//     var options = {
//         title: `Watch ${streamer.User.display_name} on Twitch`,
//         message: `${streamer.User.display_name} has just gone live`,
//         type: "basic",
//         iconUrl: URL.createObjectURL(blob)
//     };

//     chrome.notifications.onClicked.addListener(function(notificationId : string) {  
//       chrome.tabs.create({url: `https://www.twitch.tv/${notificationId}`});
//     });  

//     return chrome.notifications.create(streamer.User.name, options /*, callback */);
//   });
// }
