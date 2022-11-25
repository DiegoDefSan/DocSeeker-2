import { AuditTrail } from '../../../shared/domain/values/audit-trail.value';
import { PatientName } from '../../../shared/domain/values/patient-name.value';
import { Patient } from '../aggregates/client/patient.entity';
import { ClientId } from '../aggregates/client/client-id.value';
import { Dni } from '../../../shared/domain/values/dni.value';

export class PatientFactory {
  public static withId(id: ClientId, name: PatientName, dni: Dni, auditTrail: AuditTrail): Patient {
    let patient: Patient = new Patient(name, dni, auditTrail);
    patient.changeId(id);
    return patient;
  }

  public static from(name: PatientName, dni: Dni, auditTrail: AuditTrail): Patient {
    return new Patient(name, dni, auditTrail);
  }
}