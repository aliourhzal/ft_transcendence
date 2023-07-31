/* eslint-disable @typescript-eslint/no-empty-interface */
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



export interface ArrayOfClinets{
    
    userId : string;
    socketIds : string;
}


export interface roomShape{

    id: string;
    room_name: string;
    password: string;
    roomStauts: string;

}


export enum RoomType {
    PUBLIC = "PUBLIC",
    PROTECTED = "PROTECTED",
    PRIVATE = "PRIVATE"
}

export enum UserTypRoomType {
    USER = 'USER',
    ADMIN = "ADMIN",
    OWNER = "OWNER"
}

export interface AllMessages {
    user: string;
    msg: string;
  }


export  interface ListOfRoomsOfUser
{
    userId: string;
    userType: string;
    roomId: string;
    socketId?: string;
    room: {
      id: string;
      room_name: string;
      password?: string;
      roomType: string;
    }

}