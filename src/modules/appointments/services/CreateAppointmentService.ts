import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsReporisoty from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsReporisoty')
    private appointmentsRepository: IAppointmentsReporisoty,
  ) {}

  public async execute({
    date,
    provider_id,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentHour = startOfHour(date);

    const AlreadyBookedHour = await this.appointmentsRepository.findByDate(
      appointmentHour,
    );

    if (AlreadyBookedHour) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentHour,
    });
    return appointment;
  }
}
export default CreateAppointmentService;
