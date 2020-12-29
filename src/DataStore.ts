export module DataStore {
    export class DataStoreClass {
    
        // LoadData(key : string, callBack: (data: string) => void): void
        // {   
        //     let val :any = "BaseBase";
        
        //     callBack(val);
        // }
    
        // SaveData(key : string , data : any, callBack: (saveOk : boolean) => void): void
        // {
        //     console.log("B SaveUserNode");
        // }


        
        LoadData(key : string)  : Promise<any>
        {
            return new Promise(function (resolve,reject){
                reject('Base Datastore called');
            });
        }

        SaveData(key : string, data : any)
        {
            return new Promise(function (resolve,reject){
                reject('Base Datastore called');
            });
        }
        
}

export let DS : DataStoreClass = new DataStoreClass();
}