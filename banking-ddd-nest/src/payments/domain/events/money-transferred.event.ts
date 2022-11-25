import { PaymentStatus } from '../enums/payment.status.enum';
import { DateTime } from '../../../shared/domain/values/date-time.value';

export class MoneyTransferred {
  constructor(
    public readonly transactionId: number,
    public accountIdFrom: number,
    public accountIdTo: number,
    public amount: number,
    public status: PaymentStatus,
    public createdAt: DateTime
  ) {
  }
}