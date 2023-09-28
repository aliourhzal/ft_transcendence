import * as bcrypt from 'bcrypt'

// this function hashes the password passed to it and return the hash
export function encodePasswd(passwd: string): string {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(passwd, salt); 
}

// this function compares the plain text password and the hash stored in the database it is used to verify the user's credentials collected from the login page
export function comparePasswd(rawPasswd: string, hash: string): boolean {
    return bcrypt.compareSync(rawPasswd, hash);
}