'use client'

import ProfileContent from "./components/profileContent";
import { useRouter } from "next/navigation";
import { getCookie, userDataContext } from "./layout";
import { useContext } from "react";

export default function Profile(props) {
    const router = useRouter();
    const {nickname} = useContext(userDataContext);
    if (nickname !== props.params.nickname)
		router.push(`/${nickname}`);
    return (
        <main className='h-full w-full bg-darken-200 overflow-y-auto'>
            <ProfileContent />
        </main>
    );
}