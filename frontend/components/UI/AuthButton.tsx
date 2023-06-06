
'use client'

interface AuthButtonType {
    link: string,
    src: string,
    alt: string
}

export default function AuthButton(props: AuthButtonType) {
    return (
        <a href={props.link} className='h-14 w-14 flex justify-center items-center flex-col sm:flex-row bg-white rounded-full'>
            <img className='h-8 w-8' src={props.src} alt={props.alt} />
        </a>
    );
}