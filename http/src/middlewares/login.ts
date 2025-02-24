import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import prisma from '../prismaClient';

export const loginMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers.authorization;
    if(!token){
        res.status(401).json({message: 'Unauthorized'});
        return;
    }
    try{
        const decoded = verify(token, process.env.JWT_SECRET as string);
        const user = await prisma.user.findUnique({
            where: {
                //@ts-ignore
                id: decoded.id,
            },
        });
        if(!user){
            res.status(401).json({message: 'Unauthorized'});
            return;
        }
        //@ts-ignore
        req.user = user;
        next();
    }
    catch(err){
        res.status(401).json({message: 'Unauthorized'});
        return;
    }
}