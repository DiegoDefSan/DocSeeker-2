import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterDoctorRequest } from '../dtos/request/register-doctor-request.dto';
import { RegisterDoctorResponse } from '../dtos/response/register-doctor-response.dto';
import { RegisterDoctorValidator } from '../validators/register-doctor.validator';
import { AppNotification } from 'src/shared/application/app.notification';
import { Result } from 'typescript-result';
import { RegisterDoctor } from '../messages/commands/register-doctor.command';
import { DoctorRepository, DOCTOR_REPOSITORY } from 'src/clients/domain/aggregates/client/doctor.repository';
import { Doctor } from 'src/clients/domain/aggregates/client/doctor.entity';
import { DoctorMapper } from '../mappers/doctor.mapper';

@Injectable()
export class DoctorApplicationService {
  constructor(
    private commandBus: CommandBus,
    private registerDoctorValidator: RegisterDoctorValidator,
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctorRepository: DoctorRepository,
  ) {}

  async register(
    registerDoctorRequest: RegisterDoctorRequest,
  ): Promise<Result<AppNotification, RegisterDoctorResponse>> {
    const registerDoctor: RegisterDoctor = DoctorMapper.dtoRequestToCommand(registerDoctorRequest);
    const notification: AppNotification = await this.registerDoctorValidator.validate(registerDoctor);
    if (notification.hasErrors()) return Result.error(notification);
    const doctor: Doctor = await this.commandBus.execute(registerDoctor);
    const response: RegisterDoctorResponse = DoctorMapper.domainToDtoResponse(doctor);
    return Result.ok(response);
  }

  async getById(id: number) {
    return await this.doctorRepository.getById(id);
  }
}