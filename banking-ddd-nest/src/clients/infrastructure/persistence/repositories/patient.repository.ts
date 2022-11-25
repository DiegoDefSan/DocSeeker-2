import { InjectRepository } from "@nestjs/typeorm";
import { PatientMapper } from "src/clients/application/mappers/patient.mapper";
import { Patient } from "src/clients/domain/aggregates/client/patient.entity";
import { PatientRepository } from "src/clients/domain/aggregates/client/patient.repository";
import { Repository } from "typeorm";
import { PatientEntity } from "../entities/patient.entity";

export class PatientEntityRepository implements PatientRepository  {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
  ) {}

  async create(patient: Patient): Promise<Patient> {
    let patientEntity: PatientEntity = PatientMapper.domainToEntity(patient);
    patientEntity = await this.patientRepository.save(patientEntity);
    return PatientMapper.entityToDomain(patientEntity);
  }

  async update(patient: Patient): Promise<Patient> {
    let patientEntity: PatientEntity = PatientMapper.domainToEntity(patient);
    let patientId: number = patient.getId().getValue();
    await this.patientRepository.update({ id: patientId }, patientEntity);
    return patient;
  }

  async delete(patientId: number): Promise<boolean> {
    await this.patientRepository.delete({ id: patientId });
    return true;
  }

  async getById(id: number): Promise<Patient> {
    let patientEntity: PatientEntity = await this.patientRepository.findOne({ where: { id: id } });
    return PatientMapper.entityToDomain(patientEntity);
  }

  async getByDni(dni: string): Promise<Patient> {
    let patientEntity: PatientEntity = await this.patientRepository.createQueryBuilder().where("dni = :dni", { dni }).getOne();
    return PatientMapper.entityToDomain(patientEntity);
  }
}