
'use client'

interface AuthButtonType {
    link: string,
    src: string,
    alt: string
}

export default function AuthButton(props: AuthButtonType) {
    return (
        <a href={props.link} className='ping-slow h-14 w-14 flex justify-center items-center flex-col sm:flex-row bg-white rounded-full relative'>
            <img className='h-8 w-8' src={props.src} alt={props.alt} />
            <div className='h-full w-full rounded-full absolute bg-darken-100/40 backdrop-blur-[1px] flex justify-center items-center opacity-0'>
                <span className='text-white opacity-0 font-medium'>{`login with ${props.alt}`}</span>
            </div>
        </a>
    );
}