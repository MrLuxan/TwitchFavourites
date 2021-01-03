export module DataStore {
    export class DataStoreClass {
    
        LoadData(key : string)  : Promise<any>
        {
            return new Promise(function (resolve,reject){
                reject('Base Datastore called');
            });
        }

        SaveData(key : string, data : any) : Promise<any>
        {
            return new Promise(function (resolve,reject){
                reject('Base Datastore called');
            });
        }
        
}

export let DS : DataStoreClass = new DataStoreClass();
}