import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};