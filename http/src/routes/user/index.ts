
import express from 'express';
import { Request, Response } from 'express';
import prisma from '../../prismaClient';
import { decode, sign, verify } from 'jsonwebtoken';

export const userRouter = express.Router();

userRouter.post('/signup', async (req:Request, res:Response) => {
    console.log(req.body)
    const {username, firstName, lastName, email, password} = req.body;
    try{

        const isUser = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if(isUser){
            res.status(403).json({message: 'Username already exists'});
            return;
        }

        const user = await prisma.user.create({
            data: {
                username,
                firstName,
                lastName,
                email,
                password,
                role: 'USER',
                xp: 0,
            },
        });
        const token = sign({id: user.id}, process.env.JWT_SECRET as string);
        res.status(200).json({user, token});
    }
    catch(err){
        res.status(500).json(err);
    }
});

userRouter.get('/login', async (req:Request, res:Response) => {
    const {username, password} = req.body;
    try{
        const user = await prisma.user.findUnique({
            where: {
                username,
                password,
            },
        });
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json(err);
    }
});

userRouter.get('/logout', async (req:Request, res:Response) => {
    const {username, password} = req.body;
    try{
        const user = await prisma.user.findUnique({
            where: {
                username,
                password,
            },
        });
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json(err);
    }
});