//@ts-nocheck
import express from 'express';
import { Request, Response } from 'express';
import prisma from '../../prismaClient';
import { loginMiddleware } from '../../middlewares/login';

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const forumRouter = express.Router();

// Get all forums with optional pagination
forumRouter.get('/all', async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [forums, total] = await Promise.all([
      prisma.forum.findMany({
        skip,
        take: limit,
        include: {
          admin: {
            select: {
              username: true,
              id: true
            }
          },
          _count: {
            select: { posts: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.forum.count()
    ]);

    res.status(200).json({
      forums,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error('Error fetching forums:', err);
    res.status(500).json({ message: 'Failed to fetch forums' });
  }
});

// Get single forum with details
forumRouter.get('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid forum ID' });
    }

    const forum = await prisma.forum.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            username: true,
            id: true
          }
        },
        posts: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
        },
        // include: {
        //     user: {
        //       select: {
        //         username: true,
        //         id: true
        //       }
        //     }
        // },
        _count: {
          select: { posts: true }
        }
      }
    });

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    res.status(200).json(forum);
  } catch (err) {
    console.error('Error fetching forum:', err);
    res.status(500).json({ message: 'Failed to fetch forum' });
  }
});

forumRouter.post('/create', loginMiddleware, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    // Check if forum name already exists
    const existingForum = await prisma.forum.findFirst({
      where: { name }
    });

    if (existingForum) {
      return res.status(409).json({ message: 'Forum name already exists' });
    }

    const forum = await prisma.forum.create({
      data: {
        name,
        description,
        adminId: req.user!.id
      },
      include: {
        admin: {
          select: {
            username: true,
            id: true
          }
        }
      }
    });

    res.status(201).json(forum);
  } catch (err) {
    console.error('Error creating forum:', err);
    res.status(500).json({ message: 'Failed to create forum' });
  }
});

// Update forum
forumRouter.put('/:id', loginMiddleware, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    const { name, description } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid forum ID' });
    }

    if (!name && !description) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    // Check if user is admin of the forum or has ADMIN role
    const forum = await prisma.forum.findUnique({
      where: { id }
    });

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    if (forum.adminId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to update this forum' });
    }

    // If name is being updated, check for duplicates
    if (name && name !== forum.name) {
      const existingForum = await prisma.forum.findFirst({
        where: { name }
      });

      if (existingForum) {
        return res.status(409).json({ message: 'Forum name already exists' });
      }
    }

    const updatedForum = await prisma.forum.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
      },
      include: {
        admin: {
          select: {
            username: true,
            id: true
          }
        }
      }
    });

    res.status(200).json(updatedForum);
  } catch (err) {
    console.error('Error updating forum:', err);
    res.status(500).json({ message: 'Failed to update forum' });
  }
});

forumRouter.post('/join/:id', loginMiddleware, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid forum ID' });
    }

    // Check if user is admin of the forum or has ADMIN role
    const forum = await prisma.forum.findUnique({
      where: { id }
    });

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    if (forum.adminId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to join this forum' });
    }
    console.log(req.user!.id, id);

    const existingMember = await prisma.forumMember.findFirst({
      where: { userId: req.user!.id, forumId: id }
    });

    if (existingMember) {
      return res.status(409).json({ message: 'User is already a member of this forum' });
    }

    const member = await prisma.forumMember.create({
      data: {
        userId: req.user!.id,
        forumId: id,
        role: 'MEMBER',
        joinedAt: new Date()
      },
      include: {
        user: {
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

    res.status(201).json(member);
  } catch (err) {
    console.error('Error joining forum:', err);
    res.status(500).json({ message: 'Failed to join forum' });
  }
});

// Delete forum
forumRouter.delete('/:id', loginMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid forum ID' });
    }

    // Check if user is admin of the forum or has ADMIN role
    const forum = await prisma.forum.findUnique({
      where: { id }
    });

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    if (forum.adminId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to delete this forum' });
    }

    await prisma.forum.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Forum deleted successfully' });
  } catch (err) {
    console.error('Error deleting forum:', err);
    res.status(500).json({ message: 'Failed to delete forum' });
  }
});

forumRouter.get("/isAdmin/:id", loginMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const isAdmin = await prisma.forum.findUnique({
      where: { 
        id: Number(id),
        adminId: userId  
      },
      select: {
        admin: true
      }
    });

    if (!isAdmin) {
      return res.status(400).json({ message: 'Not an admin' });
    }

    return res.status(200).json({ isAdmin: true });
  } catch (err) {
    console.error('Error getting isAdmin:', err);
    res.status(500).json({ message: 'Failed to get isAdmin' });
  }
});