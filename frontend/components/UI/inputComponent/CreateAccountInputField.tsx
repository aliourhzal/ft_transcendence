
import Input from './InputComponent';

import styles from './CreateAccountInputField.module.css'

interface InputBlocProps {
    label: string,
    errorMsg: string,
    inputType: string,
    inputPlaceholder: string
}

export default function CreateAccountInputField(props: InputBlocProps) {
    return (
        <div className={styles.inputField}>
            <label className={styles.inputLabel}>{props.label}</label>
            <span className={styles.errorMsg}>{props.errorMsg}</span>
            <Input className={styles.createAccountInput} type={props.inputType} placeholder={props.inputPlaceholder}/>
        </div>
    );
}