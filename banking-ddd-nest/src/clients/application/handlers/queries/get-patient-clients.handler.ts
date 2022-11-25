import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { PatientClientDto } from '../../dtos/response/patient-client.dto';
import { GetPatientClients } from '../../messages/queries/get-patient-clients.query';
import { PatientMapper } from '../../mappers/patient.mapper';

@QueryHandler(GetPatientClients)
export class GetPatientClientsHandler implements IQueryHandler<GetPatientClients> {
  constructor(private dataSource: DataSource) {}

  async execute(query: GetPatientClients) {
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
      type = 'P'
    ORDER BY
      last_name, first_name;`;
    const rows = await manager.query(sql);
    if (rows.length <= 0) return [];
    const patientClients: PatientClientDto[] = rows.map(function (row: any) {
      return PatientMapper.ormToPatientClientDto(row);
    });
    return patientClients;
  }
}