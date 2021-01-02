import { response, Router } from 'express';
import Auth from '../services/Auth';

const sessionRoutes = Router();

sessionRoutes.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;
    const session = new Auth();

    const { user, token } = await session.execute({
      email,
      password,
    });

    delete user.password;

    return response.status(200).json({ user: user, token, ok: true });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default sessionRoutes;
