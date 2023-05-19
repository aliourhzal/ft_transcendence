
import styles from './ButtonComponent.module.css'

interface ButtonProps {
    type?: "button" | "submit" | "reset",
    label: string,
    className?: string,
}

export default function Button(props: ButtonProps) {
    return (
        <button className={`${styles.btn} ${props.className}`} type={props.type}>{props.label}</button>
    );
}