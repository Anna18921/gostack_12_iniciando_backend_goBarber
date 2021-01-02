import { response, Router } from 'express';
import multer from 'multer';
import ensureAuthenticated from '../middlewares/ensureAuthentiticated';
import CreateUserService from '../services/CreateUserService';
import uploadConfig from '../config/upload';

const usersRoutes = Router();

const upload = multer(uploadConfig);

usersRoutes.post('/', async (request, response) => {
  try {
    const { email, password, name } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    return response.json({ ok: true });
  }
);
export default usersRoutes;
