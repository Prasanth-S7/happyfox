import express from 'express';
import { Request, Response } from 'express';
import prisma from '../../prismaClient';

export const chatRouter = express.Router();

chatRouter.get('/all', async (req:Request, res:Response) => {
    try{
        const chats = await prisma.chat.findMany();
        res.status(200).json(chats);
    }
    catch(err){
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

chatRouter.post('/create', async (req:Request, res:Response) => {
    const {message, authorId} = req.body;
    try{
        const chat = await prisma.chat.create({
            data: {
                message,
                authorId
            },
        });
        res.status(200).json(chat);
    }
    catch(err){
        res.status(500).json(err);
    }
});

chatRouter.post('/update', async (req:Request, res:Response) => {
    const {id, message, authorId} = req.body;
    try{
        const chat = await prisma.chat.update({
            where: {
                id,
            },
            data: {
                message,
                authorId
            },
        });
        res.status(200).json(chat);
    }
    catch(err){
        res.status(500).json(err);
    }
});

chatRouter.post('/delete', async (req:Request, res:Response) => {
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