import { Router } from 'express';
import { hash } from 'bcryptjs';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import ensureAuthentication from '../midlewares/ensureAuthentication';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const createUserService = new CreateUserService();

  const hashedPass = await hash(password, 8);
  const user = await createUserService.execute({
    name,
    email,
    password: hashedPass,
  });
  delete user.password;
  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthentication,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatarService = new UpdateUserAvatarService();
    const user = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });
    return response.json(user);
  },
);

export default usersRouter;
