'use client'
import { io, Socket } from "socket.io-client";
import { createContext } from "react";

export const socket = io('http://127.0.0.1:3003');
export const WebsocketContext = createContext<Socket>(socket);

//or you can just use <WebsocketContext.Provider> </>
export const webSocketProvider = WebsocketContext.Provider;