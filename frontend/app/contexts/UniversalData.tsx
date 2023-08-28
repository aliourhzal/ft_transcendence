import { createContext } from "react";
import { Socket } from "socket.io-client";

export interface UniversalData {
	intra_Id?: number,
	wallet?: number,
	grade?: string,
	level?: number,
	firstName?: string,
	lastName?: string,
	email?: string,
	nickname?: string,
	wins?: number,
	losses?: number,
	password?: boolean,
	profilePic?: string,
	coverPic?: string,
	status: string,
	chatSocket: Socket
}

export const userDataContext = createContext<UniversalData>(null);