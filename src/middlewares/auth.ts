import { Request, Response, NextFunction, request } from 'express';
import * as jwt from 'jsonwebtoken';

export const auth = async (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({ message: 'Token is required' });
    }

    const [, token] = authHeader.split(' ');

    try {
        jwt.verify(token, process.env.APP_SECRET);
        next();
    } catch (error) {
        response.status(401).json({ message: 'Invalid token' });
    }
}