import { DateTime } from '../../../../shared/domain/values/date-time.value';
import { PaymentStatus } from '../../../domain/enums/payment.status.enum';

export class DepositMoney {
  constructor(
    public readonly accountNumber: string,
    public readonly amount: number,
    public readonly status: PaymentStatus,
    public readonly createdAt: DateTime
  ) {}
}