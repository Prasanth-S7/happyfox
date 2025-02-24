import express from 'express';
import { Request, Response } from 'express';
import prisma from '../../prismaClient';

export const forumRouter = express.Router();

forumRouter.get('/all', async (req:Request, res:Response) => {
    try{
        const forums = await prisma.forum.findMany();
        res.status(200).json(forums);
    }
    catch(err){
        res.status(500).json(err);
    }
});

forumRouter.get('/:id', async (req:Request, res:Response) => {
    const id = Number(req.params.id);
    try{
        const forum = await prisma.forum.findUnique({
            where: {
                id,
            },
        });
        res.status(200).json(forum);
    }
    catch(err){
        res.status(500).json(err);
    }
});

forumRouter.post('/create', async (req:Request, res:Response) => {
    const {name, description, adminId} = req.body;
    try{
        const forum = await prisma.forum.create({
            data: {
                name,
                description,
                adminId
            },
        });
        res.status(200).json(forum);
    }
    catch(err){
        res.status(500).json(err);
    }
});

forumRouter.post('/update', async (req:Request, res:Response) => {
    const {id, name, description, adminId} = req.body;
    try{

        const isAdmin = await prisma.user.findUnique({
            where: {
                id: adminId,
            },
        });

        if(!isAdmin){
            res.status(403).json({message: 'You are not authorized to perform this action'});
            return;
        }

        if(isAdmin.role !== 'ADMIN'){
            res.status(403).json({message: 'You are not authorized to perform this action'});
        }
        
        const forum = await prisma.forum.update({
            where: {
                id,
            },
            data: {
                name,
                description,
            },
        });
        res.status(200).json(forum);
    }
    catch(err){
        res.status(500).json(err);
    }
});

forumRouter.post('/delete', async (req:Request, res:Response) => {
    const {id} = req.body;
    try{
        const forum = await prisma.forum.delete({
            where: {
                id,
            },
        });
        res.status(200).json(forum);
    }
    catch(err){
        res.status(500).json(err);
    }
});