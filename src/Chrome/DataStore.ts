declare var chrome : any;
export module DataStore {

    export class DataStoreClass 
    {
        LoadData(key : string) // : Promise<any>
        {
            return new Promise(function (resolve,reject){
                chrome.storage.sync.get("TwitchFavourites", (items : any) => {
                    let TwitchFavourites : { [key: string]: any; } = items.TwitchFavourites; 
                    if(TwitchFavourites === undefined)
                        TwitchFavourites = {};

                    let data = (TwitchFavourites[key] === undefined ? null : TwitchFavourites[key]);
                    resolve(data);
                });
            });
        }

        SaveData(key : string, data : any)
        {
            return new Promise(function (resolve,reject){
                chrome.storage.sync.get("TwitchFavourites", (items : any) => {
                    let TwitchFavourites : { [key: string]: any; } = items.TwitchFavourites; 
                    if(TwitchFavourites === undefined)
                        TwitchFavourites = {};
                        
                    TwitchFavourites[key] = data;
                    chrome.storage.sync.set({"TwitchFavourites": TwitchFavourites}, () => {
                        resolve(true);
                    });
                });
            });
        }
    }

export let DS : DataStoreClass = new DataStoreClass();
}