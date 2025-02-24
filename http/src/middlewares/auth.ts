// @ts-nocheck
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid authentication' });
    }
    
    req.user = { id: user.id };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export {
    authenticate
}