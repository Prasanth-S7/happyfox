//@ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import prisma from '../prismaClient';

interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    xp: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface JwtCustomPayload extends JwtPayload {
  id: number;
}

export const loginMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for token in both headers and cookies
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.token;

    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (cookieToken?.length > 0) {
      token = cookieToken
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const decoded = verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtCustomPayload;


    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        xp: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// Optional: Role-based middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};