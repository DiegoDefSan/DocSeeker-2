import { AccountId } from 'src/accounts/domain/aggregates/account/account-id.value';
import { Currency } from 'src/shared/domain/enums/currency.enum';
import { AuditTrail } from 'src/shared/domain/values/audit-trail.value';
import { DateTime } from 'src/shared/domain/values/date-time.value';
import { Money } from 'src/shared/domain/values/money.value';
import { PaymentId } from 'src/payments/domain/aggregates/payment/payment-id.value';
import { PaymentType } from 'src/payments/domain/enums/payment-type.enum';
import { PaymentStatus } from 'src/payments/domain/enums/payment.status.enum';
import { PaymentFactory } from 'src/payments/domain/factories/payment.factory';
import { PaymentEntity } from 'src/payments/infrastructure/persistence/entities/payment.entity';
import { AccountIdFromValue } from 'src/payments/infrastructure/persistence/values/account-id-from.value';
import { AccountIdToValue } from 'src/payments/infrastructure/persistence/values/account-id-to.value';
import { AmountValue } from 'src/payments/infrastructure/persistence/values/amount.value';
import { UserId } from 'src/users/domain/agreggates/user/user-id.value';
import { Payment } from '../../domain/aggregates/payment/payment.entity';
import { TransferMoney } from '../messages/commands/transfer-money.command';
import { WithdrawMoney } from '../messages/commands/withdraw-money.command';

export class PaymentMapper {
  public static withdrawMoneyToDomain(command: WithdrawMoney, accountId: AccountId): Payment {
    const amount: Money = Money.create(command.amount, Currency.SOLES);
    const auditTrail: AuditTrail = AuditTrail.from(
      command.createdAt != null ? command.createdAt : null,
      UserId.of(1),
      null,
      null
    );
    let payment: Payment = PaymentFactory.create(
      PaymentType.WITHDRAW, 
      PaymentStatus.STARTED, 
      accountId, 
      null, 
      amount,
      auditTrail);
    return payment;
  }

  public static depositMoneyToDomain(command: WithdrawMoney, accountId: AccountId): Payment {
    const amount: Money = Money.create(command.amount, Currency.SOLES);
    const auditTrail: AuditTrail = AuditTrail.from(
      command.createdAt != null ? command.createdAt : null,
      UserId.of(1),
      null,
      null
    );
    let payment: Payment = PaymentFactory.create(
      PaymentType.DEPOSIT, 
      PaymentStatus.STARTED, 
      accountId, 
      null, 
      amount,
      auditTrail);
    return payment;
  }

  public static transferMoneyToDomain(command: TransferMoney, fromAccountId: AccountId, toAccountId: AccountId): Payment {
    const amount: Money = Money.create(command.amount, Currency.SOLES);
    const auditTrail: AuditTrail = AuditTrail.from(
      command.createdAt != null ? command.createdAt : null,
      UserId.of(1),
      null,
      null
    );
    let payment: Payment = PaymentFactory.create(
      PaymentType.TRANSFER, 
      PaymentStatus.STARTED, 
      fromAccountId, 
      toAccountId,
      amount,
      auditTrail);
    return payment;
  }

  public static domainToEntity(payment: Payment): PaymentEntity {
    const paymentEntity: PaymentEntity = new PaymentEntity();
    paymentEntity.type = payment.getType();
    paymentEntity.status = payment.getStatus();
    paymentEntity.accountIdFrom = AccountIdFromValue.from(payment.getAccountFrom().getValue());
    paymentEntity.accountIdTo = payment.getAccountTo() != null ? AccountIdToValue.from(payment.getAccountTo().getValue()) : null;
    paymentEntity.amount = AmountValue.from(payment.getAmount().getAmount(), payment.getAmount().getCurrency());
    return paymentEntity;
  }

  public static entityToDomain(paymentEntity: PaymentEntity): Payment {
    const amount: Money = Money.create(paymentEntity.amount.amount, paymentEntity.amount.currency);
    const auditTrail: AuditTrail = AuditTrail.from(
      paymentEntity.auditTrail.createdAt != null ? DateTime.fromString(paymentEntity.auditTrail.createdAt) : null,
      paymentEntity.auditTrail.createdBy != null ? UserId.of(paymentEntity.auditTrail.createdBy) : null,
      paymentEntity.auditTrail.updatedAt != null ? DateTime.fromString(paymentEntity.auditTrail.updatedAt) : null,
      paymentEntity.auditTrail.updatedBy != null ? UserId.of(paymentEntity.auditTrail.updatedBy) : null
    );
    const accountId: AccountId = AccountId.of(paymentEntity.accountIdFrom.value);
    const paymentId: PaymentId = PaymentId.of(paymentEntity.id);
    let payment: Payment = PaymentFactory.withId(
      paymentId,
      PaymentType.WITHDRAW, 
      PaymentStatus.STARTED, 
      accountId, 
      null, 
      amount,
      null);
    return payment;
  }
}