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

                    let data = (TwitchFavourites[key] === undefined ? "" : TwitchFavourites[key]);
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

        LoadData2(key : string, callBack: (data: string) => void): void
        {   
            chrome.storage.sync.get("TwitchFavourites", (items : any) => {
                let TwitchFavourites : { [key: string]: any; } = items.TwitchFavourites; 
                if(TwitchFavourites === undefined)
                    TwitchFavourites = {};

                let data = (TwitchFavourites[key] === undefined ? "" : TwitchFavourites[key]);
                callBack(data);
            });        
        }

        SaveData2(key : string , data : any, callBack: (saveOk : boolean) => void): void
        {
            chrome.storage.sync.get("TwitchFavourites", (items : any) => {
                let TwitchFavourites : { [key: string]: any; } = items.TwitchFavourites; 
                if(TwitchFavourites === undefined)
                    TwitchFavourites = {};
                    
                TwitchFavourites[key] = data;
                chrome.storage.sync.set({"TwitchFavourites": TwitchFavourites}, () => {
                    callBack(true);
                });
            });
        }



    }

export let DS : DataStoreClass = new DataStoreClass();
}