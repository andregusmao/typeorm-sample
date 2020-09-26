import { getRepository } from 'typeorm';
import { request, Request, Response } from 'express';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export const login = async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const [user] = await getRepository(User).find({
        where: {
            email
        }
    });

    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id }, process.env.APP_SECRET, {
                expiresIn: '1d'
            });
            const data = {
                id: user.id,
                name: user.name,
                email: user.email,
                token
            };

            return response.json(data);
        }
    }
    return response.status(404).json({ message: 'User not found' });
}

export const listUsers = async (request: Request, response: Response) => {
    const user = await getRepository(User).find();

    return response.json(user);
}

export const saveUser = async (request: Request, response: Response) => {
    const { name, email, password } = request.body;

    try {
        const passwordHash = '123';//await bcrypt.hash(password, 8);

        const user = await getRepository(User).save({
            name,
            email,
            password: passwordHash
        });

        return response.json(user);
    } catch (error) {
        return response.status(500).json({ message: error });
    }
}