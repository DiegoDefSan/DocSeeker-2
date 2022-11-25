import { InjectRepository } from "@nestjs/typeorm";
import { DoctorMapper } from "src/clients/application/mappers/doctor.mapper";
import { Doctor } from "src/clients/domain/aggregates/client/doctor.entity";
import { DoctorRepository } from "src/clients/domain/aggregates/client/doctor.repository";
import { Repository } from "typeorm";
import { DoctorEntity } from "../entities/doctor.entity";

export class DoctorEntityRepository implements DoctorRepository  {
  constructor(
    @InjectRepository(DoctorEntity)
    private doctorRepository: Repository<DoctorEntity>,
  ) {}

  async create(doctor: Doctor): Promise<Doctor> {
    let doctorEntity: DoctorEntity = DoctorMapper.domainToEntity(doctor);
    doctorEntity = await this.doctorRepository.save(doctorEntity);
    return DoctorMapper.entityToDomain(doctorEntity);
  }

  async update(doctor: Doctor): Promise<Doctor> {
    let doctorEntity: DoctorEntity = DoctorMapper.domainToEntity(doctor);
    let doctorId: number = doctor.getId().getValue();
    await this.doctorRepository.update({ id: doctorId }, doctorEntity);
    return doctor;
  }

  async delete(doctorId: number): Promise<boolean> {
    await this.doctorRepository.delete({ id: doctorId });
    return true;
  }

  async getById(id: number): Promise<Doctor> {
    let doctorEntity: DoctorEntity = await this.doctorRepository.findOne({ where: { id: id } });
    return DoctorMapper.entityToDomain(doctorEntity);
  }

  async getByDni(dni: string): Promise<Doctor> {
    let doctorEntity: DoctorEntity = await this.doctorRepository.createQueryBuilder().where("dni = :dni", { dni }).getOne();
    return DoctorMapper.entityToDomain(doctorEntity);
  }
}