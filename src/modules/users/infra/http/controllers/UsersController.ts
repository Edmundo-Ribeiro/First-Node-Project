import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import { hash } from 'bcryptjs';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const createUserService = container.resolve(CreateUserService);

    const hashedPass = await hash(password, 8);
    const user = await createUserService.execute({
      name,
      email,
      password: hashedPass,
    });
    delete user.password;
    return response.json(user);
  }
}
