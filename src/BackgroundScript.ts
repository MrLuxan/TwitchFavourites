import { message } from "../node_modules/gulp-typescript/release/utils";
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
    port.postMessage({Command: "Update", Time : time, StreamerList : hub.GetList()});
  });
}


chrome.runtime.onConnect.addListener((port : any) => {
  port.onMessage.addListener(function(msg : any) {

    console.log(msg);

    switch(msg.Command)
    {
      case 'Register':
        console.log('New port',port);
        Ports.push(port);
        port.onDisconnect.addListener((p : any) =>{ Ports = Ports.filter(a => a != p); });
        port.postMessage({Command : 'Setup' , StreamerList : hub.GetList()});
        break;

      case 'Favourited':
        console.log('Favourited',msg.Streamer);

        hub.AddStreamer(msg.Streamer)
        .then((data) => {
          console.log(data)
          IssueListUp();
        })
        .catch((error) =>{
          console.log(error);
        });

        break;
      
      case 'Unfavourited':
        console.log('Unfavourited',msg.Streamer);
        
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
