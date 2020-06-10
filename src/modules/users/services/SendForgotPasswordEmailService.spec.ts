import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUserRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('Should be able to recover the password using email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'Diego',
      email: 'Diego@rocketseat.com',
      password: '1223456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'Diego@rocketseat.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not be able to recover the password of a non-existing user', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'Diego@rocketseat.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to generate the forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'Diego',
      email: 'Diego@rocketseat.com',
      password: '1223456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'Diego@rocketseat.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
