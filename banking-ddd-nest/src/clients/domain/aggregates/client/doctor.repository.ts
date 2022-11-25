import { Doctor } from "./doctor.entity";

export const DOCTOR_REPOSITORY = 'DoctorRepository';

export interface DoctorRepository {
  create(doctor: Doctor): Promise<Doctor>;
  update(doctor: Doctor): Promise<Doctor>;
  delete(doctorId: number): Promise<boolean>;
  getById(id: number): Promise<Doctor>;
  getByDni(dni: string): Promise<Doctor>;
}