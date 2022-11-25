import { Inject, Injectable } from '@nestjs/common';
import { AppNotification } from 'src/shared/application/app.notification';
import { RegisterDoctor } from '../messages/commands/register-doctor.command';
import { DoctorRepository, DOCTOR_REPOSITORY } from 'src/clients/domain/aggregates/client/doctor.repository';
import { Doctor } from 'src/clients/domain/aggregates/client/doctor.entity';

@Injectable()
export class RegisterDoctorValidator {
  constructor(
    @Inject(DOCTOR_REPOSITORY)
    private doctorRepository: DoctorRepository,
  ) {
  }

  public async validate(registerDoctor: RegisterDoctor,): Promise<AppNotification> {
    let notification: AppNotification = new AppNotification();
    const firstName: string = registerDoctor.firstName ? registerDoctor.firstName.trim() : '';
    if (firstName.length <= 0) {
      notification.addError('firstName is required', null);
    }
    const lastName: string = registerDoctor.lastName ? registerDoctor.lastName.trim() : '';
    if (lastName.length <= 0) {
      notification.addError('lastName is required', null);
    }
    const dni: string = registerDoctor.dni ? registerDoctor.dni.trim() : '';
    if (dni.length <= 0) {
      notification.addError('dni is required', null);
    }
    if (notification.hasErrors()) {
      return notification;
    }
    const doctor: Doctor = await this.doctorRepository.getByDni(dni);
    if (doctor != null) notification.addError('dni is taken', null);
    
    return notification;
  }
}