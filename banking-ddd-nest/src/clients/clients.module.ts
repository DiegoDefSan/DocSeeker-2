import { Module } from '@nestjs/common';
import { CompanyApplicationService } from './application/services/company-application.service';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterPatientValidator } from './application/validators/register-patient.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterCompanyHandler } from './application/handlers/commands/register-company.handler';
import { PatientRegisteredHandler } from '../notifications/application/handlers/events/patient-registered.handler';
import { GetPatientClientsHandler } from './application/handlers/queries/get-patient-clients.handler';
import { PatientApplicationService } from './application/services/patient-application.service';
import { RegisterCompanyValidator } from './application/validators/register-company.validator';
import { RegisterPatientHandler } from './application/handlers/commands/register-patient.handler';
import { CompanyRegisteredHandler } from '../notifications/application/handlers/events/company-registered.handler';
import { ClientEntity } from './infrastructure/persistence/entities/client.entity';
import { PatientEntity } from './infrastructure/persistence/entities/patient.entity';
import { CompanyEntity } from './infrastructure/persistence/entities/company.entity';
import { PatientController } from './interface/rest/patient.controller';
import { CompanyController } from './interface/rest/company.controller';
import { PatientEntityRepository } from './infrastructure/persistence/repositories/patient.repository';
import { CompanyEntityRepository } from './infrastructure/persistence/repositories/company.repository';
import { GetCompanyClientsHandler } from './application/handlers/queries/get-company-clients.handler';
import { Patient_REPOSITORY } from './domain/aggregates/client/patient.repository';
import { COMPANY_REPOSITORY } from './domain/aggregates/client/company.repository';
import { DoctorRegisteredHandler } from 'src/notifications/application/handlers/events/doctor-registered.handler';
import { DoctorEntity } from './infrastructure/persistence/entities/doctor.entity';
import { DoctorController } from './interface/rest/doctor.controller';
import { DOCTOR_REPOSITORY } from './domain/aggregates/client/doctor.repository';
import { DoctorApplicationService } from './application/services/doctor-application.service';
import { RegisterDoctorValidator } from './application/validators/register-doctor.validator';
import { RegisterDoctorHandler } from './application/handlers/commands/register-doctor.handler';
import { GetDoctorClientsHandler } from './application/handlers/queries/get-doctor-clients.handler';
import { DoctorEntityRepository } from './infrastructure/persistence/repositories/doctor.repository';

export const CommandHandlers = [RegisterPatientHandler, RegisterCompanyHandler, RegisterDoctorHandler];
export const EventHandlers = [PatientRegisteredHandler, CompanyRegisteredHandler, DoctorRegisteredHandler];
export const QueryHandlers = [GetPatientClientsHandler, GetCompanyClientsHandler, GetDoctorClientsHandler];

@Module({
  imports: [
  CqrsModule,
    TypeOrmModule.forFeature([ClientEntity, PatientEntity, CompanyEntity, DoctorEntity]),
  ],
  exports: [TypeOrmModule],
  controllers: [PatientController, CompanyController, DoctorController],
  providers: [
    { useClass: PatientEntityRepository, provide: Patient_REPOSITORY },
    { useClass: CompanyEntityRepository, provide: COMPANY_REPOSITORY },
    { useClass: DoctorEntityRepository, provide: DOCTOR_REPOSITORY },
    PatientApplicationService,
    CompanyApplicationService,
    DoctorApplicationService,

    RegisterPatientValidator,
    RegisterCompanyValidator,
    RegisterDoctorValidator,

    PatientEntityRepository,
    CompanyEntityRepository,
    DoctorEntityRepository,

    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers
  ]
})
export class ClientsModule {}