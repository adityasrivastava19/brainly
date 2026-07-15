import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : undefined;

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  const secret = process.env.jwt_secret ?? process.env.jwt_secert;
  if (!secret) {
    return res.status(500).json({ message: 'Server misconfiguration' });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload | string;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'invalid token' });
  }
};