/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { Socket } from 'socket.io-client';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class ApiTokenCheckMiddleware implements NestMiddleware 
{
    constructor(private readonly jwtService:JwtService, 
        private readonly utils:UtilsService,
        ) {}
    async use(request: Request, res: Response , next: NextFunction) 
    {
        
        const token = this.utils.verifyJwtFromHeader(request.headers['authorization']);
        if (token) 
        {
            const user = await this.utils.verifyToken(token)
          
            if (user) 
            {
                const ifUserExist = await this.utils.getUserId([user['sub']]);
                
                
                // if(ifUserExist.error)
                // {
                //     console.log(ifUserExist.error)
                //     return ;
                // }
                
            }
        }
        next();
    } 
}
