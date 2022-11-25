import { AuditTrail } from '../../../shared/domain/values/audit-trail.value';
import { DoctorName } from '../../../shared/domain/values/doctor-name.value';
import { Doctor } from '../aggregates/client/doctor.entity';
import { ClientId } from '../aggregates/client/client-id.value';
import { Dni } from '../../../shared/domain/values/dni.value';

export class DoctorFactory {
  public static withId(id: ClientId, name: DoctorName, dni: Dni, auditTrail: AuditTrail): Doctor {
    let doctor: Doctor = new Doctor(name, dni, auditTrail);
    doctor.changeId(id);
    return doctor;
  }

  public static from(name: DoctorName, dni: Dni, auditTrail: AuditTrail): Doctor {
    return new Doctor(name, dni, auditTrail);
  }
}