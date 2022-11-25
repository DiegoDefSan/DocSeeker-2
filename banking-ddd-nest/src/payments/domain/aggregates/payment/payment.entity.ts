import { Money } from '../../../../shared/domain/values/money.value';
import { AggregateRoot } from '@nestjs/cqrs';
import { PaymentId } from './payment-id.value';
import { AccountId } from '../../../../accounts/domain/aggregates/account/account-id.value';
import { AuditTrail } from '../../../../shared/domain/values/audit-trail.value';
import { PaymentType } from '../../enums/payment-type.enum';
import { PaymentStatus } from '../../enums/payment.status.enum';
import { MoneyDeposited } from '../../events/money-deposited.event';
import { MoneyWithdrawn } from '../../events/money-withdrawn.event';
import { MoneyTransferred } from '../../events/money-transferred.event';

export class Payment extends AggregateRoot {
  private id: PaymentId;
  private type: PaymentType;
  private status: PaymentStatus;
  private accountFrom: AccountId;
  private accountTo: AccountId;
  private amount: Money;
  private auditTrail: AuditTrail;

  public constructor(id:PaymentId, type: PaymentType, status: PaymentStatus, accountFrom: AccountId, accountTo: AccountId, amount: Money, auditTrail: AuditTrail) {
    super();
    this.id = id;
    this.type = type;
    this.status = status;
    this.accountFrom = accountFrom;
    this.accountTo = accountTo;
    this.amount = amount;
    this.auditTrail = auditTrail;
  }

  public deposit() {
    const event = new MoneyDeposited(this.id.getValue(), this.accountFrom.getValue(), this.amount.getAmount(), this.status, null);
    this.apply(event);
  }

  public withdraw() {
    const event = new MoneyWithdrawn(this.id.getValue(), this.accountFrom.getValue(), this.amount.getAmount(), this.status, null);
    this.apply(event);
  }

  public transfer() {
    const event = new MoneyTransferred(this.id.getValue(), this.accountFrom.getValue(), this.accountTo.getValue(), this.amount.getAmount(), this.status, null);
    this.apply(event);
  }

  public complete() {
    this.status = PaymentStatus.COMPLETED;
  }

  public getId(): PaymentId {
    return this.id;
  }

  public getType(): PaymentType {
    return this.type;
  }

  public getStatus(): PaymentStatus {
    return this.status;
  }

  public getAccountFrom(): AccountId {
    return this.accountFrom;
  }

  public getAccountTo(): AccountId {
    return this.accountTo;
  }

  public getAmount(): Money {
    return this.amount;
  }

  public getAuditTrail(): AuditTrail {
    return this.auditTrail;
  }

  public changeId(id: PaymentId) {
    this.id = id;
  }
}