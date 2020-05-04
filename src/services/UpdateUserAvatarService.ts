import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface RequestDTO {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  async execute({ user_id, avatarFilename }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { id: user_id },
    });
    if (!user) {
      throw new AppError(
        'Only authenticaded users can change the avatar.',
        401,
      );
    }
    delete user.password;

    if (user.avatar) {
      const userAvatarFilePath = path.join(
        uploadConfig.directoryPath,
        user.avatar,
      );
      const userAvatarFileExist = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExist) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    user.avatar = avatarFilename;
    await userRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
