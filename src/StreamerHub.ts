import {Streamer} from "./Streamer"
import {DataStore} from "./DataStore";
import { Settings } from "./InterfaceSettings";
declare var chrome : any;


export class StreamerHub
{
    Settings : Settings;
    Streamers : Streamer[] = [];
    
    LoadStreamers() : Promise<any>
    {
      let sers = this.Streamers;      
      return new Promise(function (resolve,reject){
      
        DataStore.DS.LoadData('ids')
        .then((savedid : Array<string>) =>{ 

          let ps : Promise<any>[]  = [];
          savedid.forEach((id: string) => {
            let newStream = new Streamer();
            ps.push(newStream.SetStreamByID(id));
            ps.push(newStream.SetUserByID(id));
            sers.push(newStream);
          });
      
          Promise.all(ps).then((val) =>{
            resolve([true,val]);
            console.log('Load ok',val);
          }).catch((error) => {
            console.log('load error',error)
            reject([false,error]);            
          });
        })
        .catch((error) => {
          console.log('loaderror',error)
          reject([false,error]);            
        });
      });
    }

    SaveStreamers() : Promise<any>
    {
      let hub = this;
      return new Promise(function (resolve){
        let streamerIds : Array<string> = [];
        hub.Streamers.forEach((streamer)=>{
          streamerIds.push(streamer.User._id);
        });

        DataStore.DS.SaveData('ids',streamerIds)
        .then()
        .catch()
      });
    }
    
    AddStreamer(add : Streamer) : Promise<any>
    {
      let hub = this;
      return new Promise(function (resolve,reject){
        if(hub.Streamers.filter(streamer => streamer.User._id == add.User._id).length == 0)
        {
          hub.Streamers.push(add);
          let resolvefunc : any = resolve;
          hub.SaveStreamers()
          .then(resolvefunc('Save ok'));
        }
        else{
          reject('Streamer allready stored');
        }
      });
    }

    RemoveStreamer(add : Streamer) : Promise<any>
    {
      let hub = this;
      return new Promise(function (resolve,reject){
        if(hub.Streamers.filter(streamer => streamer.User._id == add.User._id).length == 1)
        {
          hub.Streamers = hub.Streamers.filter(streamer => streamer.User._id != add.User._id);

          let resolvefunc : any = resolve;
          hub.SaveStreamers()
          .then(resolvefunc('Remove ok'));
        }
        else{
          reject('Streamer was not stored');
        }
      });
    }

    Refresh() : Promise<any>
    {      
      let hub = this;
      return new Promise(function (resolve,reject){
        let promises : Promise<void>[] = [];
        hub.Streamers.forEach(streamer => {
          promises.push(streamer.Refresh());
        });

        Promise.all(promises)
        .then((res) =>{
          resolve(res);
        })
        .catch((error) =>{
          reject(error);
        });
      });
    }
    
    GetDisplayList() : Streamer[]
    {
        let streamerlist : Streamer[] = this.GetOnlineChannels();
        if(this.Settings.ShowOffileChannelsInList){
          streamerlist = streamerlist.concat(this.GetOfflineChannels());
        }
        return streamerlist;
    }

    NumberCompare( a : Streamer, b : Streamer) {
      if ( a.Stream.viewers > b.Stream.viewers ){
        return -1;
      }
      if ( a.Stream.viewers < b.Stream.viewers ){
        return 1;
      }
      return 0;   
    }

    AlphabetiseCompare( a : Streamer, b : Streamer) {
        if ( a.User.display_name.toLowerCase() < b.User.display_name.toLowerCase() ){
          return -1;
        }
        if ( a.User.display_name.toLowerCase() > b.User.display_name.toLowerCase() ){
          return 1;
        }
        return 0;
      }

    GetOnlineChannels() : Streamer[]
    {
        let onlineStreamers : Streamer[] = this.Streamers.filter(streamer => streamer.Stream != null);
        
        console.log('Sort',this.Settings.SortChannelBy);
        
        if(this.Settings.SortChannelBy == "A"){
          return onlineStreamers.sort(this.AlphabetiseCompare);
        }else{
          return onlineStreamers.sort(this.NumberCompare);
        }
    }

    GetOfflineChannels() : Streamer[]
    {
        let offlineStreamers : Streamer[] = this.Streamers.filter(streamer => streamer.Stream == null);
        return offlineStreamers.sort(this.AlphabetiseCompare);
    }

    constructor(setting : Settings)
    {
      this.Settings = setting;
    }
}