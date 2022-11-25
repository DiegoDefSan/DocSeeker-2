import { AuditTrail } from "src/shared/domain/values/audit-trail.value";
import { Dni } from "src/shared/domain/values/dni.value";
import { PatientName } from "src/shared/domain/values/patient-name.value";
import { PatientFactory } from "../../factories/patient.factory";
import { ClientId } from "./client-id.value";
import { Patient } from "./patient.entity";


describe('Patient', () => {
    let patient: Patient;
    let patientName: PatientName;
    let patientId: ClientId;
    let dni: Dni;
    let auditTrail: AuditTrail;

    beforeEach(() =>{
        patientId = ClientId.of(1)
        dni = Dni.create('12345678');
        patientName = PatientName.create('Miguel','Vega');
    });

    describe('change_dni', () => {
        it("dni should be changed", () =>{
            const newDni = Dni.create('09876543');

            patient = PatientFactory.withId(patientId,patientName,dni,auditTrail);
            patient.changeDni(newDni);

            expect(patient.getDni()).toBe(newDni);
        });
    });

});