/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
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
        // check user who send req is exsit or not
        try 
        {
            
            const token = this.utils.verifyJwtFromHeader(request.headers['authorization']);
            
            if (token) 
            {
                const user = await this.utils.verifyToken(token);
                if (user) 
                {
                    const ifUserExist = await this.utils.getUserId([user['sub']]);
                     
                    if(ifUserExist.error)
                    {
                        console.log(ifUserExist.error)
                        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
                    }
                    request['user'] = user;
                    next();                        
                }
                
                else
                {
                    console.log('here')
                    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
                }
            }
            else
            {
                console.log('invalid jwt')
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }
        }
        catch (error) 
        {
            console.log('error')
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    } 
}
