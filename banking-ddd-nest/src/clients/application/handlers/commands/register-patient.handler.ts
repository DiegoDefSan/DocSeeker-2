import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RegisterPatient } from '../../messages/commands/register-patient.command';
import { PatientMapper } from '../../mappers/patient.mapper';
import { Patient } from 'src/clients/domain/aggregates/client/patient.entity';
import { Inject } from '@nestjs/common';
import { PatientRepository, Patient_REPOSITORY } from 'src/clients/domain/aggregates/client/patient.repository';
import { AppSettings } from 'src/shared/application/app-settings';
import { DataSource } from 'typeorm';

@CommandHandler(RegisterPatient)
export class RegisterPatientHandler
  implements ICommandHandler<RegisterPatient> {
  constructor(
    private dataSource: DataSource,
    @Inject(Patient_REPOSITORY)
    private readonly patientRepository: PatientRepository,
    private publisher: EventPublisher
  ) {
  }

  async execute(command: RegisterPatient) {
    let patient: Patient = PatientMapper.commandToDomain(command, AppSettings.SUPER_ADMIN);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      patient = await this.patientRepository.create(patient);
      if (patient == null) throw new Error("");
      patient = this.publisher.mergeObjectContext(patient);
      patient.register();
      patient.commit();
      await queryRunner.commitTransaction();
    } catch(err) {
      await queryRunner.rollbackTransaction();
      patient = null;
    } finally {
      await queryRunner.release();
    }
    return patient;
  }
}