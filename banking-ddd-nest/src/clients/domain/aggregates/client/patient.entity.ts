import { ClientType } from 'src/clients/domain/aggregates/client/client-type.enum';
import { PatientRegistered } from 'src/clients/domain/events/patient-registered.event';
import { AuditTrail } from 'src/shared/domain/values/audit-trail.value';
import { PatientName } from 'src/shared/domain/values/patient-name.value';
import { ClientId } from './client-id.value';
import { Dni } from '../../../../shared/domain/values/dni.value';
import { Client } from './client.root.entity';

export class Patient extends Client {
  private name: PatientName;
  private dni: Dni;

  public constructor(name: PatientName, dni: Dni, auditTrail: AuditTrail) {
    super(ClientType.PATIENT, auditTrail);
    this.name = name;
    this.dni = dni;
  }

  public register() {
    const event = new PatientRegistered(this.id.getValue(), this.name.getFirstName(), this.name.getLastName(), this.dni.getValue());
    this.apply(event);
  }

  public getId(): ClientId {
    return this.id;
  }

  public getName(): PatientName {
    return this.name;
  }

  public getDni(): Dni {
    return this.dni;
  }

  public getAuditTrail(): AuditTrail {
    return this.auditTrail;
  }

  public changeName(name: PatientName): void {
    this.name = name;
  }

  public changeDni(dni: Dni): void {
    this.dni = dni;
  }
}