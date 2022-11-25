import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { DoctorClientDto } from '../../dtos/response/doctor-client.dto';
import { GetDoctorClients } from '../../messages/queries/get-doctor-clients.query';
import { DoctorMapper } from '../../mappers/doctor.mapper';

@QueryHandler(GetDoctorClients)
export class GetDoctorClientsHandler implements IQueryHandler<GetDoctorClients> {
  constructor(private dataSource: DataSource) {}

  async execute(query: GetDoctorClients) {
    const manager = this.dataSource.createEntityManager();
    const sql = `
    SELECT 
      id,
      first_name as firstName,
      last_name as lastName,
      dni
    FROM 
      clients
    WHERE
      type = 'D'
    ORDER BY
      last_name, first_name;`;
    const rows = await manager.query(sql);
    if (rows.length <= 0) return [];
    const doctorClients: DoctorClientDto[] = rows.map(function (row: any) {
      return DoctorMapper.ormToDoctorClientDto(row);
    });
    return doctorClients;
  }
}