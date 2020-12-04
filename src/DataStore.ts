declare var chrome: any;
export module DataStore {

    export enum ReminderOption { Never, Days, Saves }
    export enum OnDupOption { KeepCurrent, UseBackup, Merge }

    export class DataStoreClass {
    
    AddChannel(username : string, callBack: (note: string) => void): void
    {   
        let usernote :string = "BaseBase";
        callBack(usernote);
    }

    RemoveChannel(user : string , note : string, callBack: (saveOk : boolean) => void): void
    {
        console.log("B SaveUserNode");
    }
}

export let DS : DataStoreClass = new DataStoreClass();
}