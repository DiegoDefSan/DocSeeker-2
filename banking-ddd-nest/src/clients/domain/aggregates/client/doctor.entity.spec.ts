import { Doctor } from "./doctor.entity";
import { AuditTrail } from "src/shared/domain/values/audit-trail.value";
import { Dni } from "src/shared/domain/values/dni.value";
import { DoctorName } from "src/shared/domain/values/doctor-name.value";
import { DoctorFactory } from "../../factories/doctor.factory";
import { ClientId } from "./client-id.value";


describe('Doctor', () => {
    let doctor: Doctor;
    let doctorName : DoctorName;
    let doctorId: ClientId;
    let dni: Dni;
    let auditTrail : AuditTrail;

    beforeEach(() =>{
        doctorId = ClientId.of(1)
        dni = Dni.create('12345678');
        doctorName = DoctorName.create('Jorge','Santos');
    });

    describe('change_name', () => {
        it("name should be changed", () =>{
            const newName = DoctorName.create('Juan','Ramirez');

            doctor = DoctorFactory.withId(doctorId,doctorName,dni,auditTrail);
            doctor.changeName(newName);

            expect(doctor.getName()).toBe(newName);
        });
    });
});

describe('Doctor', () => {
    let doctor: Doctor;
    let doctorName : DoctorName;
    let doctorId: ClientId;
    let dni: Dni;
    let auditTrail : AuditTrail;

    beforeEach(() =>{
        doctorId = ClientId.of(1)
        dni = Dni.create('12345678');
        doctorName = DoctorName.create('Jorge','Santos');
    });

    describe('change_id', () => {
        it("id should be changed", () =>{
            const newId = ClientId.of(123);

            doctor = DoctorFactory.withId(doctorId,doctorName,dni,auditTrail);
            doctor.changeId(newId);

            expect(doctor.getId()).toBe(newId);
        });
    });
});