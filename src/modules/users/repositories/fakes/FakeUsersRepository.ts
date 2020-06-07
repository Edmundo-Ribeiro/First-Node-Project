import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';

class FakeUsersRepository implements IUserRepository {
  private users: User[] = [];

  public async create(userData: ICreateUserDTO): Promise<User> {
    const newUser = new User();
    Object.assign(newUser, { id: uuid() }, userData);
    this.users.push(newUser);
    return newUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(
      searchUser => searchUser.id === user.id,
    );
    this.users[userIndex] = user;
    return user;
  }
}

export default FakeUsersRepository;
