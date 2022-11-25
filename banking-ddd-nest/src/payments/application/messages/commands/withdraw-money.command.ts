import { PaymentStatus } from '../../../domain/enums/payment.status.enum';
import { DateTime } from '../../../../shared/domain/values/date-time.value';

export class WithdrawMoney {
  constructor(
    public readonly accountNumber: string,
    public readonly amount: number,
    public readonly status: PaymentStatus,
    public readonly createdAt: DateTime
  ) {}
}