'use client'
import { io, Socket } from "socket.io-client";
import { createContext } from "react";
import { getCookie } from "../[nickname]/layout";

export const socket = io('http://127.0.0.1:3030', {
    auth: {
        token: getCookie('access_token'),
    },
});
export const InvitationSocketContext = createContext<Socket>(socket);
