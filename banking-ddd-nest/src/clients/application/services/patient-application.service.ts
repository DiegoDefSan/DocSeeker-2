import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterPatientRequest } from '../dtos/request/register-patient-request.dto';
import { RegisterPatientResponse } from '../dtos/response/register-patient-response.dto';
import { RegisterPatientValidator } from '../validators/register-patient.validator';
import { AppNotification } from 'src/shared/application/app.notification';
import { Result } from 'typescript-result';
import { RegisterPatient } from '../messages/commands/register-patient.command';
import { PatientRepository, Patient_REPOSITORY } from 'src/clients/domain/aggregates/client/patient.repository';
import { Patient } from 'src/clients/domain/aggregates/client/patient.entity';
import { PatientMapper } from '../mappers/patient.mapper';

@Injectable()
export class PatientApplicationService {
  constructor(
    private commandBus: CommandBus,
    private registerPatientValidator: RegisterPatientValidator,
    @Inject(Patient_REPOSITORY)
    private readonly patientRepository: PatientRepository,
  ) {}

  async register(
    registerPatientRequest: RegisterPatientRequest,
  ): Promise<Result<AppNotification, RegisterPatientResponse>> {
    const registerPatient: RegisterPatient = PatientMapper.dtoRequestToCommand(registerPatientRequest);
    const notification: AppNotification = await this.registerPatientValidator.validate(registerPatient);
    if (notification.hasErrors()) return Result.error(notification);
    const patient: Patient = await this.commandBus.execute(registerPatient);
    const response: RegisterPatientResponse = PatientMapper.domainToDtoResponse(patient);
    return Result.ok(response);
  }

  async getById(id: number) {
    return await this.patientRepository.getById(id);
  }
}