import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('Should be able to cretate a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    const appointment = await createAppointment.execute({
      provider_id: '12341234',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12341234');
  });

  it('Should not be able to cretate a new appointment on a date alredy taken', async () => {
    const fakeAppointmentRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

    const repeatDate = new Date(2020, 6, 5, 12);

    await createAppointment.execute({
      provider_id: '12341234',
      date: repeatDate,
    });

    await expect(
      createAppointment.execute({
        provider_id: '12341234',
        date: repeatDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
