import { PaymentStatus } from '../enums/payment.status.enum';
import { DateTime } from '../../../shared/domain/values/date-time.value';

export class MoneyDeposited {
  constructor(
    public readonly paymentId: number,
    public readonly accountIdFrom: number,
    public readonly amount: number,
    public readonly status: PaymentStatus,
    public readonly createdAt: DateTime
  ) {
  }
}