//@ts-nocheck
import express from 'express';
import { Request, Response } from 'express';
import prisma from '../../prismaClient';
import { loginMiddleware } from '../../middlewares/login';
import { upload } from '../../controllers/eventController';

export const resourceRouter = express.Router();

resourceRouter.get('/all', async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [resources, total] = await Promise.all([
            prisma.resource.findMany({
                skip,
                take: limit,
                include: {
                    author: {
                        select: {
                            username: true,
                            id: true
                        }
                    },
                    forum: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.resource.count()
        ]);

        res.status(200).json({
            resources,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (err) {
        console.error('Error fetching resources:', err);
        res.status(500).json({ message: 'Failed to fetch resources' });
    }
});

resourceRouter.get('/all/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [resources, total] = await Promise.all([
            prisma.resource.findMany({
                where:{
                    forumId:id
                },
                skip,
                take: limit,
                include: {
                    author: {
                        select: {
                            username: true,
                            id: true
                        }
                    },
                    forum: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.resource.count()
        ]);

        res.status(200).json({
            resources,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (err) {
        console.error('Error fetching resources:', err);
        res.status(500).json({ message: 'Failed to fetch resources' });
    }
});

resourceRouter.get('/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid resource ID' });
        }

        const resource = await prisma.resource.findUnique({
            where: { id },
            include: {
              author: { 
                select: {
                  username: true,
                  id: true
                }
              },
              forum: { 
                select: {
                  name: true,
                  id: true
                }
              }
            },
          });
          

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.status(200).json(resource);
    } catch (err) {
        console.error('Error fetching resource:', err);
        res.status(500).json({ message: 'Failed to fetch resource' });
    }
});

resourceRouter.post('/create', loginMiddleware, upload.single('resource'), async (req: Request, res: Response) => {
    try {
      const { title, description, forumId, type } = req.body;
      const resourceFile = req.file;
  
      if (!title || !description || !forumId || !resourceFile) {
        return res.status(400).json({ message: 'Title, description, forum ID, and file are required' });
      }
  
      const forum = await prisma.forum.findUnique({ where: { id: Number(forumId) } });
      if (!forum) {
        return res.status(404).json({ message: 'Forum not found' });
      }
  
      const resourceUrl = `/uploads/${resourceFile.filename}`;
  
      const fileType = type || (resourceFile.mimetype.includes('pdf') ? 'pdf' : 'image');
  
      const resource = await prisma.resource.create({
        data: {
          title,
          description,
          forumId: Number(forumId),
          type: fileType,
          resourceUrl,
          authorId: req.user!.id,
        },
        include: {
          author: { select: { username: true, id: true } },
          forum: { select: { name: true, id: true } },
        },
      });
  
      res.status(201).json(resource);
    } catch (err) {
      console.error('Error creating resource:', err);
      res.status(500).json({ message: 'Failed to create resource' });
    }
  });  

resourceRouter.post('/update', loginMiddleware, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title, description, forumId } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid resource ID' });
        }

        if (!title && !description && !forumId) {
            return res.status(400).json({ message: 'Nothing to update' });
        }

        const resource = await prisma.resource.findUnique({
            where: { id }
        });

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        if (resource.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to update this resource' });
        }

        const forum = await prisma.forum.findUnique({
            where: { id: forumId }
        });

        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }

        const updatedResource = await prisma.resource.update({
            where: { id },
            data: {
                title: title || undefined,
                description: description || undefined,
                forumId: forumId || undefined,
            },
            include: {
                author: {
                    select: {
                        username: true,
                        id: true
                    }
                },
                forum: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        });

        res.status(200).json(updatedResource);
    } catch (err) {
        console.error('Error updating resource:', err);
        res.status(500).json({ message: 'Failed to update resource' });
    }
});

resourceRouter.post('/delete', loginMiddleware, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid resource ID' });
        }

        const resource = await prisma.resource.findUnique({
            where: { id }
        });

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        if (resource.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized to delete this resource' });
        }

        await prisma.resource.delete({
            where: { id }
        });

        res.status(200).json({ message: 'Resource deleted successfully' });
    } catch (err) {
        console.error('Error deleting resource:', err);
        res.status(500).json({ message: 'Failed to delete resource' });
    }
});