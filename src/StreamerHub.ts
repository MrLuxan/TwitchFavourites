import {Streamer} from "./Streamer"


export class StreamerHub
{
    Streamers : Streamer[] = [];
    
    LoadStreamers()
    {
      let ids = ['9092112', '145622021','85875635','276657249','54808447']; 

      let promises : Promise<void>[] = [];
			ids.forEach(id => {
        let newStream = new Streamer();
        this.Streamers.push(newStream);
        newStream.Set(id).forEach(e => {
          promises.push(e);
        });
      });

      Promise.all(promises)
      .then((res) =>{

        console.log(res);

        this.Streamers.forEach(element => {
          console.log(element);
        });

        console.log('load');
        //callBack();
      }
      );
      



    }

    SaveStreamers()
    {

    }
    
    AddStreamer()
    {
        
    }

    RemoveStreamer()
    {
        
    }



    Refresh(callBack : any)
    {      
        let promises : Promise<void>[] = [];
        this.Streamers.forEach(streamer => {
          promises.push(streamer.Refresh());
        });

        Promise.all(promises)
        .then((res) =>{

          console.log(res);

          //callBack();
        }
        );
    }
    
    GetList() : Streamer[]
    {
        let streamerlist : Streamer[] = this.GetOnlineChannels();
        streamerlist = streamerlist.concat(this.GetOfflineChannels());
        return streamerlist;
    }


    AlphabetiseCompare( a : Streamer, b : Streamer) {
        if ( a.User.display_name < b.User.display_name ){
          return -1;
        }
        if ( a.User.display_name > b.User.display_name ){
          return 1;
        }
        return 0;
      }

    GetOnlineChannels() : Streamer[]
    {
        let onlineStreamers : Streamer[] = this.Streamers.filter(streamer => streamer.Stream != null);
        return onlineStreamers.sort(this.AlphabetiseCompare);
    }

    GetOfflineChannels() : Streamer[]
    {
        let offlineStreamers : Streamer[] = this.Streamers.filter(streamer => streamer.Stream == null);
        return offlineStreamers.sort(this.AlphabetiseCompare);
    }

    
}