import { StreamerHub } from "./StreamerHub";

export { };

declare var chrome : any;

let hub : StreamerHub;
let Ports : any[] = [];


chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
  // create alarm after extension is installed / upgraded
  chrome.alarms.create('refresh', { periodInMinutes: 1 });

  hub = new StreamerHub();
  hub.LoadStreamers();
});


chrome.alarms.onAlarm.addListener((alarm : any) => {
  //console.log(alarm.name); // refresh

  var currentdate = new Date(); ;
  let time = currentdate.getHours() + ":"  
  + currentdate.getMinutes() + ":" 
  + currentdate.getSeconds()

  console.log(time);
  Ports.forEach(port => {
    port.postMessage({Command: "Update", Time : time, StreamerList : hub.GetList()});
  });

});

chrome.runtime.onConnect.addListener((port : any) => {
  port.onMessage.addListener(function(msg : any) {
    if(msg.Command == 'Register')
    {
      console.log('New port',port)
      Ports.push(port);
      port.onDisconnect.addListener((p : any) =>{ Ports = Ports.filter(a => a != p); });
      port.postMessage({Command : 'Setup' , StreamerList : hub.GetList()});
    }
  });
});
