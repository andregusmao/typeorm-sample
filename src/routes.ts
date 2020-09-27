import { Router, Request, Response } from 'express';
import { login, listUsers, saveUser, updateUser, deleteUser } from './controller/UserController';
import { auth } from './middlewares/auth';

const routes = Router();

routes.get('/', (request: Request, response: Response) => {
    return response.json({ message: 'Hello Man' });
});
routes.post('/session', login);
routes.get('/users', auth, listUsers);
routes.post('/users', auth, saveUser);
routes.put('/users', auth, updateUser);
routes.delete('/users/:id', auth, deleteUser);

export default routes;