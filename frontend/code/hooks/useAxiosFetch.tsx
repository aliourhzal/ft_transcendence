import axios from "axios";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export function useEffectmod(x: number, socket: Socket)
{
    useEffect(() => {
        socket.emit("gameData", x);
    }, [x]);
    return x;
}

export default function useAxiosFetch(url: string,) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoding] = useState(false);
    const [err, setErr] = useState();
    useEffect(() => {
        setIsLoding(true);
        axios.get(url, {
            withCredentials: true
        }).then(res => {setData(res.data)})
        .finally(() => setIsLoding(false))
    }, [url]);
    return({
        data, isLoading, err
    })
}