import { PostMessage, PostMessageCommand } from "./InterfacePostMessage";
import { StreamerHub } from "./StreamerHub";
export { };

declare var chrome : any;

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
  //console.log(alarm.name); // refresh
  IssueListUp();
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
