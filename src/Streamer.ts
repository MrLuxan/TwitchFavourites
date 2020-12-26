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
						resolve(true);
					} catch (error) {
						reject(['Channel not found ' + id , error])
					}
                }
            });
        });
	}

	SetUserByID(id : string) : any
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
						resolve(true);
					} catch (error) {
						reject(['Channel not found ' + id , error])
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

    constructor()
    {
		/*
		this.User._id = id;

		Promise.all([this.SetUserByID(id),this.SetStreamByID(id)])
		.then((result) => {
			this.User = result[0];
			this.Stream = result[1];

			console.log(this.User,this.Stream);
		})
        .catch(error => { 
            console.log('error');
            console.error(error)
		});
		*/
    }

}