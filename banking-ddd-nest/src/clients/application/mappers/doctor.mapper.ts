import { DoctorEntity } from 'src/clients/infrastructure/persistence/entities/doctor.entity';
import { Doctor } from 'src/clients/domain/aggregates/client/doctor.entity';
import { DoctorNameValue } from 'src/clients/infrastructure/persistence/values/doctor-name.value';
import { DniValue } from 'src/clients/infrastructure/persistence/values/dni.value';
import { AuditTrailValue } from 'src/shared/infrastructure/persistence/values/audit-trail.value';
import { RegisterDoctor } from '../messages/commands/register-doctor.command';
import { DoctorName } from 'src/shared/domain/values/doctor-name.value';
import { Dni } from 'src/shared/domain/values/dni.value';
import { AuditTrail } from 'src/shared/domain/values/audit-trail.value';
import { DateTime } from 'src/shared/domain/values/date-time.value';
import { UserId } from 'src/users/domain/agreggates/user/user-id.value';
import { DoctorFactory } from 'src/clients/domain/factories/doctor.factory';
import { DoctorClientDto } from '../dtos/response/doctor-client.dto';
import { ClientId } from 'src/clients/domain/aggregates/client/client-id.value';
import { RegisterDoctorRequest } from '../dtos/request/register-doctor-request.dto';
import { RegisterDoctorResponse } from '../dtos/response/register-doctor-response.dto';

export class DoctorMapper {
  public static dtoRequestToCommand(registerDoctorRequest: RegisterDoctorRequest) {
    return new RegisterDoctor(
      registerDoctorRequest.firstName,
      registerDoctorRequest.lastName,
      registerDoctorRequest.dni,
    );
  }

  public static domainToDtoResponse(doctor: Doctor) {
    return new RegisterDoctorResponse(
      doctor.getId().getValue(),
      doctor.getName().getFirstName(),
      doctor.getName().getLastName(),
      doctor.getDni().getValue(),
      doctor.getAuditTrail().getCreatedAt().format(),
      doctor.getAuditTrail().getCreatedBy().getValue()
    );
  }
  
  public static commandToDomain(command: RegisterDoctor, userId: number): Doctor {
    const doctorName: DoctorName = DoctorName.create(command.firstName, command.lastName);
    const dni: Dni = Dni.create(command.dni);
    const auditTrail: AuditTrail = AuditTrail.from(
      DateTime.utcNow(),
      UserId.of(userId),
      null,
      null
    );
    let doctor: Doctor = DoctorFactory.from(doctorName, dni, auditTrail);
    return doctor;
  }

  public static domainToEntity(doctor: Doctor): DoctorEntity {
    const doctorEntity: DoctorEntity = new DoctorEntity();
    doctorEntity.name = DoctorNameValue.from(doctor.getName().getFirstName(), doctor.getName().getLastName());
    doctorEntity.dni = DniValue.from(doctor.getDni().getValue());
    const createdAt: string = doctor.getAuditTrail() != null && doctor.getAuditTrail().getCreatedAt() != null ? doctor.getAuditTrail().getCreatedAt().format() : null;
    const createdBy: number = doctor.getAuditTrail() != null && doctor.getAuditTrail().getCreatedBy() != null ? doctor.getAuditTrail().getCreatedBy().getValue() : null;
    const updatedAt: string = doctor.getAuditTrail() != null && doctor.getAuditTrail().getUpdatedAt() != null ? doctor.getAuditTrail().getUpdatedAt().format() : null;
    const updatedBy: number = doctor.getAuditTrail() != null && doctor.getAuditTrail().getUpdatedBy() != null ? doctor.getAuditTrail().getUpdatedBy().getValue() : null;
    const auditTrailValue: AuditTrailValue = AuditTrailValue.from(createdAt, createdBy, updatedAt, updatedBy);
    doctorEntity.auditTrail = auditTrailValue;
    return doctorEntity;
  }

  public static entityToDomain(doctorEntity: DoctorEntity): Doctor {
    if (doctorEntity == null) return null;
    const doctorName: DoctorName = DoctorName.create(doctorEntity.name.firstName, doctorEntity.name.lastName);
    const dni: Dni = Dni.create(doctorEntity.dni.value);
    const auditTrail: AuditTrail = AuditTrail.from(
      doctorEntity.auditTrail.createdAt != null ? DateTime.fromString(doctorEntity.auditTrail.createdAt) : null,
      doctorEntity.auditTrail.createdBy != null ? UserId.of(doctorEntity.auditTrail.createdBy) : null,
      doctorEntity.auditTrail.updatedAt != null ? DateTime.fromString(doctorEntity.auditTrail.updatedAt) : null,
      doctorEntity.auditTrail.updatedBy != null ? UserId.of(doctorEntity.auditTrail.updatedBy) : null
    );
    const clientId: ClientId = ClientId.of(doctorEntity.id);
    let doctor: Doctor = DoctorFactory.withId(clientId, doctorName, dni, auditTrail);
    return doctor;
  }

  public static ormToDoctorClientDto(row: any): DoctorClientDto {
    let dto = new DoctorClientDto();
    dto.id = Number(row.id);
    dto.firstName = row.firstName;
    dto.lastName = row.lastName;
    dto.dni = row.dni;
    return dto;
  }
}