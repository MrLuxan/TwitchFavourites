export interface User {
    _id?: string;
    bio?: string;
    created_at?: Date;
    display_name?: string;
    logo?: string;
    name: string;
    type?: string;
    updated_at?: Date;
}

export interface UserData {
    _total: number;
    users: User[];
}