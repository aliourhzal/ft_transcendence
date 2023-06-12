import axios from "axios";
import { useEffect, useState } from "react";

export default function useAxiosFetch(url: string,) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoding] = useState(false);
    const [err, setErr] = useState();
    useEffect(() => {
        setIsLoding(true);
        axios.get(url, {
            withCredentials: true
        }).then(res => setData(res.data))
        .catch((err) => console.log(err))
        .finally(() => setIsLoding(false))
    }, [url]);
    return({
        data, isLoading, err
    })
}