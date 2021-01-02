import { ChannelData,Stream,Channel,Preview } from "./InterfaceStream";
import { User,UserData} from "./InterfaceUser";

export class Streamer {

	User : User;
	Stream : Stream;

    RequestData(url : string, headers : any = null)
    {
        return new Promise(function (resolve,reject){
            const xhr = new XMLHttpRequest();
            xhr.onload = function(){
                resolve(this);
            };

            xhr.onerror = function(){
				console.log(xhr);
				reject(new Error('Network error'));
            };

            xhr.open('get', url);
            if(headers != null){
                for (const property in headers) {
					xhr.setRequestHeader(property, headers[property]);
                }
            }
            xhr.send();
        });
    }
	
	SetStreamByID(id : string) : any
    {
		let s = this;
        return new Promise(function(resolve,reject){
            let headers = {'Client-ID' : '5m2a2ybreyk8p8s9dhwg2s933nh3iw', 'Accept' : 'application/vnd.twitchtv.v5+json'};
            s.RequestData('https://api.twitch.tv/kraken/streams/' + id , headers).then(function (xhr : XMLHttpRequest){				
				if(xhr.status !== 200){
                    reject('Error geting user data ' + id);
                }else{
					try {
						let ChannelData : ChannelData = JSON.parse(xhr.responseText);
						s.Stream = ChannelData.stream;
						//console.log('SetStreamByID ' + id)
						resolve(s.Stream);
					} catch (error) {
						reject(['Channel not found ' + id , error])
					}
                }
            });
        });
	}

	SetUserByID(id : string) : Promise<any>
    {
		let s = this;
        return new Promise(function(resolve,reject){
            let headers = {'Client-ID' : '5m2a2ybreyk8p8s9dhwg2s933nh3iw', 'Accept' : 'application/vnd.twitchtv.v5+json'};
            s.RequestData('https://api.twitch.tv/kraken/users/' + id , headers).then(function (xhr : XMLHttpRequest){				
				if(xhr.status !== 200){
                    reject('Error geting user data ' + id);
                }else{
					try {
						s.User = JSON.parse(xhr.responseText);
						//console.log('SetUserByID ' + id);
						resolve(s.User);
					} catch (error) {
						reject(['Channel not found ' + id , error])
					}
                }
            });
		});
	}

    SetUserByName(channelName : string) : Promise<any>
    {
        let s = this;
        return new Promise(function(resolve,reject){
            let headers = {'Client-ID' : '5m2a2ybreyk8p8s9dhwg2s933nh3iw', 'Accept' : 'application/vnd.twitchtv.v5+json'};
            s.RequestData('https://api.twitch.tv/kraken/users?login=' + channelName, headers).then(function (xhr :any ){
                if(xhr.status !== 200){
                    //console.log("There was an error");
                    reject('Error geting user data ' + channelName);
                }else{
                    let data = JSON.parse(xhr.responseText);
                    if(data.users.length == 0)
                    {
                        reject('Channel not found ' + channelName )
                    }
                    else
                    {
						s.User = data.users[0];
						resolve(s.User);
                    }
                }
            });
        });
    }	

	Refresh()
	{
		return this.SetStreamByID(this.User._id);
	}

	Set(id : string)
	{
		return [this.SetUserByID(id),this.SetStreamByID(id)];
	}
}