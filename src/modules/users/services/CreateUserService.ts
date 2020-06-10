import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  name: string;
  email: string;
  password: string;
}
@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IRequestDTO): Promise<User> {
    const emailAlreadyused = await this.usersRepository.findByEmail(email);

    if (emailAlreadyused) {
      throw new AppError('This email was alredy used');
    }

    const hashpassword = await this.hashProvider.genareteHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashpassword,
    });

    return user;
  }
}

export default CreateUserService;
