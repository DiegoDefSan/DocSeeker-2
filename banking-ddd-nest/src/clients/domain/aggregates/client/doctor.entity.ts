import { ClientType } from 'src/clients/domain/aggregates/client/client-type.enum';
import { DoctorRegistered } from 'src/clients/domain/events/doctor-registered.event';
import { AuditTrail } from 'src/shared/domain/values/audit-trail.value';
import { DoctorName } from 'src/shared/domain/values/doctor-name.value';
import { ClientId } from './client-id.value';
import { Dni } from '../../../../shared/domain/values/dni.value';
import { Client } from './client.root.entity';

export class Doctor extends Client {
  private name: DoctorName;
  private dni: Dni;

  public constructor(name: DoctorName, dni: Dni, auditTrail: AuditTrail) {
    super(ClientType.DOCTOR, auditTrail);
    this.name = name;
    this.dni = dni;
  }

  public register() {
    const event = new DoctorRegistered(this.id.getValue(), this.name.getFirstName(), this.name.getLastName(), this.dni.getValue());
    this.apply(event);
  }

  public getId(): ClientId {
    return this.id;
  }

  public getName(): DoctorName {
    return this.name;
  }

  public getDni(): Dni {
    return this.dni;
  }

  public getAuditTrail(): AuditTrail {
    return this.auditTrail;
  }

  public changeName(name: DoctorName): void {
    this.name = name;
  }

  public changeDni(dni: Dni): void {
    this.dni = dni;
  }
}