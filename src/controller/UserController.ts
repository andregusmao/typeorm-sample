import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export const login = async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const user = await getRepository(User).findOne({
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
    const users = await getRepository(User)
        .createQueryBuilder('user')
        .select(['user.id as id', 'user.name as name', 'user.email as email'])
        .getRawMany();

    return response.json(users);
}

export const saveUser = async (request: Request, response: Response) => {
    const { name, email, password } = request.body;

    try {
        const passwordHash = await bcrypt.hash(password, 8);

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

export const updateUser = async (request: Request, response: Response) => {
    const { id, name, email, password } = request.body;

    try {
        const passwordHash = await bcrypt.hash(password, 8);

        const user = await getRepository(User).findOne({
            where: {
                id
            }
        });

        if (user) {
            const userUpdated = await getRepository(User).save({
                id,
                name,
                email,
                password: passwordHash
            });

            return response.json(userUpdated);
        }

        return response.status(404).json({ message: 'User not found' });
    } catch (error) {
        return response.status(500).json({ message: error });
    }
}

export const deleteUser = async (request: Request, response: Response) => {
    const id = request.params.id;

    const user = await getRepository(User).findOne({
        where: {
            id
        }
    });

    if (user) {
        await getRepository(User).delete(user);

        return response.json({ message: 'User deleted' });
    }

    return response.status(404).json({ message: 'User not found' });
}