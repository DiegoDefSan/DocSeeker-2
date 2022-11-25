import { PaymentStatus } from '../../../domain/enums/payment.status.enum';
import { DateTime } from '../../../../shared/domain/values/date-time.value';

export class TransferMoney {
  constructor(
    public fromAccountNumber: string,
    public toAccountNumber: string,
    public amount: number,
    public status: PaymentStatus,
    public createdAt: DateTime
  ) {}
}