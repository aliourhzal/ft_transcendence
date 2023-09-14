'use client'
import { io, Socket } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "../[nickname]/layout";

export const socket = io(`http://${process.env.NEXT_PUBLIC_BACK}:3003`, {
    auth: {
        token: getCookie('access_token')
    },
    // autoConnect: true
});
export const WebsocketContext = createContext<Socket>(socket);

interface Props {
    children : React.ReactNode
}

export function WebSocketProvider({ children } : Props)
{
    const [Gsocket, setGameSocket] = useState<Socket>(socket);

    useEffect(() => {
        socket.connect();
        setGameSocket(socket);
        return () => {
            socket.disconnect();
        };
    }
    ,[socket.connected]);

    return (
      <WebsocketContext.Provider value={Gsocket}>{children}</WebsocketContext.Provider>
    );
}

//or you can just use <WebsocketContext.Provider> </>
// export const WebSocketProvider = WebsocketContext.Provider;