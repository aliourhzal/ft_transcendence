export const verifyName = (name: string, setName: Function): boolean => {
    if (name === '')
    {
        setName('this field is required!');
        return (false);
    }
    if (!name.includes(' '))
    {
        setName('please enter firstname and lastname');
        return (false);
    }
    setName('');
    return (true);
}

export const verifyNickname = (nickname: string, setNickname: Function): boolean => {
    if (nickname === '')
    {
        setNickname('this field is required!');
        return (false);
    }
    setNickname('');
    return true;
}

export const verifyEmail = (email: string, setEmail: Function): boolean => {
    if (email === '')
    {
        setEmail('this field is required!');
        return (false);
    }
    if (!email.includes('@')){
        setEmail('email not valid!');
        return (false);
    }
    setEmail('');
    return (true);
}

export const verifyPasswd = (passwd: string, setPasswd: Function): boolean => {
    if (passwd === '')
    {
        setPasswd('this field is required!');
        return (false);
    }
    if (passwd.length < 8)
    {
        setPasswd('8+ characters required for password')
        return (false);
    }
    setPasswd('');
    return (true);
}

export const confirmPasswd = (passwd: string, confirmationPasswd: string, setConfirm: Function) => {
    if (passwd !== confirmationPasswd)
    {
        setConfirm("password doesn't match");
        return (false);
    }
    setConfirm('');
    return (true);
}