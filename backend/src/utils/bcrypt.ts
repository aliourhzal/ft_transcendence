import * as bcrypt from 'bcrypt'

export function encodePasswd(passwd: string): string {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(passwd, salt); 
}

export function comparePasswd(rawPasswd: string, hash: string): boolean {
    return bcrypt.compareSync(rawPasswd, hash);
}