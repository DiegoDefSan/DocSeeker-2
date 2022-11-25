import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RegisterDoctor } from '../../messages/commands/register-doctor.command';
import { DoctorMapper } from '../../mappers/doctor.mapper';
import { Doctor } from 'src/clients/domain/aggregates/client/doctor.entity';
import { Inject } from '@nestjs/common';
import { DoctorRepository, DOCTOR_REPOSITORY } from 'src/clients/domain/aggregates/client/doctor.repository';
import { AppSettings } from 'src/shared/application/app-settings';
import { DataSource } from 'typeorm';

@CommandHandler(RegisterDoctor)
export class RegisterDoctorHandler
  implements ICommandHandler<RegisterDoctor> {
  constructor(
    private dataSource: DataSource,
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctorRepository: DoctorRepository,
    private publisher: EventPublisher
  ) {
  }

  async execute(command: RegisterDoctor) {
    let doctor: Doctor = DoctorMapper.commandToDomain(command, AppSettings.SUPER_ADMIN);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      doctor = await this.doctorRepository.create(doctor);
      if (doctor == null) throw new Error("");
      doctor = this.publisher.mergeObjectContext(doctor);
      doctor.register();
      doctor.commit();
      await queryRunner.commitTransaction();
    } catch(err) {
      await queryRunner.rollbackTransaction();
      doctor = null;
    } finally {
      await queryRunner.release();
    }
    return doctor;
  }
}