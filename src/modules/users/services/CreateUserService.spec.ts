import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  it('Should be able to cretate a new user', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Diego',
      email: 'Diego@rocketseat.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Diego');
    expect(user.email).toBe('Diego@rocketseat.com');
  });

  it('Should not be able to cretate a new user with an email alredy taken', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const repeatDate = 'Diego@rocketseat.com';

    await createUser.execute({
      name: 'Diego',
      email: repeatDate,
      password: '123456',
    });

    expect(
      createUser.execute({
        name: 'Outro Diego',
        email: repeatDate,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
