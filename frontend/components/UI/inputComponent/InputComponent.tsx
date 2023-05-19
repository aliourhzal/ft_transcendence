
import styles from './InputComponent.module.css'

interface InputProps {
    type: string,
    placeholder: string,
    className?: string | undefined
}

export default function Input(props: InputProps) {
    return (
        <input className={`${styles.input} ${props.className}`} type={props.type} placeholder={props.placeholder} />
    );
}