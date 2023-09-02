
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class twoFactorAuth
{
    constructor (
        private readonly userServices: UsersService
    ){}
    // private secret: any;
    private qrCode = null;
    
    secreteGenerator(id : string)
    {
        var secret = speakeasy.generateSecret();

        console.log(secret);
        qrcode.toDataURL(secret.otpauth_url, (err, data) => {
            if (err) throw Error("Qr_Code generation failed !!!");
            this.qrCode = data;
        });
        this.userServices.updateUserQr(id, secret.ascii);
        return this.qrCode;
    }
    
    async   verefyCode(id: string, tok: string)//true or false
    {
        return speakeasy.totp.verify({
            secret: (await this.userServices.findOneById(id)).AsciiSecretQr,
            encoding: 'ascii',
            token: tok
        })
    }
}