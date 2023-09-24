import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class ChangeNicknameDTO {
     
    @IsNotEmpty()
    @IsString()
    @NotContains(' ')
    newNickname: string;
}

export class ChangePassDTO {
     
    @IsNotEmpty()
    @IsString()
    newPassword: string;
}