import { AuditTrail } from '../../../shared/domain/values/audit-trail.value';
import { PaymentType } from '../enums/payment-type.enum';
import { PaymentStatus } from '../enums/payment.status.enum';
import { AccountId } from '../../../accounts/domain/aggregates/account/account-id.value';
import { Payment } from '../aggregates/payment/payment.entity';
import { Money } from '../../../shared/domain/values/money.value';
import { PaymentId } from '../aggregates/payment/payment-id.value';

export class PaymentFactory {
  public static withId(paymentId: PaymentId, type: PaymentType, status: PaymentStatus, accountIdFrom: AccountId, 
                       accountIdTo: AccountId, amount: Money, auditTrail: AuditTrail): Payment {
    return new Payment(paymentId, type, status, accountIdFrom, accountIdTo, amount, auditTrail);
  }

  public static create(
    type: PaymentType, status: PaymentStatus, accountIdFrom: AccountId, accountIdTo: AccountId, amount: Money, auditTrail: AuditTrail): Payment {
    return new Payment(null, type, status, accountIdFrom, accountIdTo, amount, auditTrail);
  }
}