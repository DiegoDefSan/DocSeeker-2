import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatus } from '../../../domain/enums/transaction.status.enum';
import { AuditTrailValue } from 'src/shared/infrastructure/persistence/values/audit-trail.value';
import { AccountIdFromValue } from '../values/account-id-from.value';
import { AccountIdToValue } from '../values/account-id-to.value';
import { AmountValue } from '../values/amount.value';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'id', unsigned: true })
  public id: number;

  @Column('char', { name: 'type', length: 1, nullable: false })
  public type: string;

  @Column((type) => AccountIdFromValue, { prefix: false })
  public accountIdFrom: AccountIdFromValue;

  @Column((type) => AccountIdToValue, { prefix: false })
  public accountIdTo: AccountIdToValue;

  @Column((type) => AmountValue, { prefix: false })
  public amount: AmountValue;

  @Column('tinyint', { name: 'status', width: 2, unsigned: true, nullable: false, })
  public status: TransactionStatus;

  @Column((type) => AuditTrailValue, { prefix: false })
  public auditTrail: AuditTrailValue;
}