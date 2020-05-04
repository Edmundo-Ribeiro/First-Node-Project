import { getRepository } from 'typeorm';
import User from '../models/User';
import AppError from '../errors/AppError';

interface RequesteDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: RequesteDTO): Promise<User> {
    const userRepository = getRepository(User);

    const emailAlreadyused = await userRepository.findOne({
      where: { email },
    });
    if (emailAlreadyused) {
      throw new AppError('This email was alredy used');
    }
    const user = userRepository.create({
      name,
      email,
      password,
    });

    await userRepository.save(user);
    return user;
  }
}

export default CreateUserService;
