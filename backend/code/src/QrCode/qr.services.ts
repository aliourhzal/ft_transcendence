
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { diskStorage } from 'multer';

@Injectable()
export class twoFactorAuth
{
    constructor (
        private readonly userServices: UsersService
    ){}
    
    async secreteGenerator(id : string)
    {
        var secret = speakeasy.generateSecret();

        const qrCodeG = await qrcode.toDataURL(secret.otpauth_url);
        const user = await this.userServices.updateUserQr(id, secret.ascii);
        // qrcode.toDataURL(secret.otpauth_url, (err, data) => {
        //     if (err) throw Error("Qr_Code generation failed !!!");
        //     this.qrCode = data;
        // });
        return {Qr: qrCodeG , active: (user ? user.twoFactorAuth : true)};
    }
    
    async   verifyCode(id: string, tok: string)//true or false
    {
        const valid = speakeasy.totp.verify({
            secret: (await this.userServices.findOneById(id)).AsciiSecretQr,
            encoding: 'ascii',
            token: tok
        });
        if (valid)
            await this.userServices.twoFactorOn(id);
        return valid;
    }
}