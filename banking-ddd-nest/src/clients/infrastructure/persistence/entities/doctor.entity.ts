import { ChildEntity, Column } from 'typeorm';
import { ClientType } from '../../../domain/aggregates/client/client-type.enum';
import { DniValue } from '../values/dni.value';
import { DoctorNameValue } from '../values/doctor-name.value';
import { ClientEntity } from './client.entity';

@ChildEntity(ClientType.DOCTOR)
export class DoctorEntity extends ClientEntity {
  @Column((type) => DoctorNameValue, { prefix: false })
  public name: DoctorNameValue;

  @Column((type) => DniValue, { prefix: false })
  public dni: DniValue;
}