/* eslint-disable prettier/prettier */

// the type of the user data provided by the 42 oauth
export interface UserData {
    intra_id: number,
    email: string,
    login?: string,
    firstName: string,
    lastName: string,
    profilePic: string,
    coverPic: string,
    wallet: number,
    level: number,
    grade: string,
    access_token?: string
}


export interface roomAndUsers {

    roomName: string;
    users : string[];
}