import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterPatientValidator } from './application/validators/register-patient.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientRegisteredHandler } from '../notifications/application/handlers/events/patient-registered.handler';
import { GetPatientClientsHandler } from './application/handlers/queries/get-patient-clients.handler';
import { PatientApplicationService } from './application/services/patient-application.service';
import { RegisterPatientHandler } from './application/handlers/commands/register-patient.handler';
import { ClientEntity } from './infrastructure/persistence/entities/client.entity';
import { PatientEntity } from './infrastructure/persistence/entities/patient.entity';
import { PatientController } from './interface/rest/patient.controller';
import { PatientEntityRepository } from './infrastructure/persistence/repositories/patient.repository';
import { Patient_REPOSITORY } from './domain/aggregates/client/patient.repository';
import { DoctorRegisteredHandler } from 'src/notifications/application/handlers/events/doctor-registered.handler';
import { DoctorEntity } from './infrastructure/persistence/entities/doctor.entity';
import { DoctorController } from './interface/rest/doctor.controller';
import { DOCTOR_REPOSITORY } from './domain/aggregates/client/doctor.repository';
import { DoctorApplicationService } from './application/services/doctor-application.service';
import { RegisterDoctorValidator } from './application/validators/register-doctor.validator';
import { RegisterDoctorHandler } from './application/handlers/commands/register-doctor.handler';
import { GetDoctorClientsHandler } from './application/handlers/queries/get-doctor-clients.handler';
import { DoctorEntityRepository } from './infrastructure/persistence/repositories/doctor.repository';

export const CommandHandlers = [RegisterPatientHandler, RegisterDoctorHandler];
export const EventHandlers = [PatientRegisteredHandler, DoctorRegisteredHandler];
export const QueryHandlers = [GetPatientClientsHandler, GetDoctorClientsHandler];

@Module({
  imports: [
  CqrsModule,
    TypeOrmModule.forFeature([ClientEntity, PatientEntity, DoctorEntity]),
  ],
  exports: [TypeOrmModule],
  controllers: [PatientController, DoctorController],
  providers: [
    { useClass: PatientEntityRepository, provide: Patient_REPOSITORY },
    { useClass: DoctorEntityRepository, provide: DOCTOR_REPOSITORY },
    PatientApplicationService,
    DoctorApplicationService,

    RegisterPatientValidator,
    RegisterDoctorValidator,

    PatientEntityRepository,
    DoctorEntityRepository,

    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers
  ]
})
export class ClientsModule {}