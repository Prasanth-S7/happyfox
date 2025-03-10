//@ts-nocheck
import express from 'express';
import { Request, Response } from 'express';
import prisma from '../../prismaClient';
import { loginMiddleware } from '../../middlewares/login';

export const chatRouter = express.Router();

chatRouter.get('/all/:id', async (req:Request, res:Response) => {
    try{

        const id = Number(req.params.id);
        const chats = await prisma.chat.findMany({
            where:{
                forumId: id
            }
        });
        return res.status(200).json(chats);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

chatRouter.get('/:id', async (req:Request, res:Response) => {
    const id = Number(req.params.id);
    try{
        const chat = await prisma.chat.findUnique({
            where: {
                id,
            },
        });
        res.status(200).json(chat);
    }
    catch(err){
        res.status(500).json(err);
    }
});

chatRouter.post('/create', loginMiddleware, async (req:Request, res:Response) => {
    const {message, authorId, forumId} = req.body;
    try{
        const chat = await prisma.chat.create({
            data: {
                message,
                forumId: Number(forumId),
                //@ts-ignore
                authorId: req.user.id
            },
        });
        res.status(200).json(chat);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

chatRouter.post('/update', loginMiddleware, async (req:Request, res:Response) => {
    const {id, message, authorId} = req.body;
    try{
        const chat = await prisma.chat.update({
            where: {
                id,
            },
            data: {
                message,
                //@ts-ignore
                authorId: req.user.id,
            },
        });
        res.status(200).json(chat);
    }
    catch(err){
        res.status(500).json(err);
    }
});

chatRouter.post('/delete', loginMiddleware, async (req:Request, res:Response) => {
    const {id} = req.body;
    try{
        const chat = await prisma.chat.delete({
            where: {
                id,
            },
        });
        res.status(200).json(chat);
    }
    catch(err){
        res.status(500).json(err);
    }
});