import { AccountId } from 'src/accounts/domain/aggregates/account/account-id.value';
import { Currency } from 'src/shared/domain/enums/currency.enum';
import { AuditTrail } from 'src/shared/domain/values/audit-trail.value';
import { DateTime } from 'src/shared/domain/values/date-time.value';
import { Money } from 'src/shared/domain/values/money.value';
import { TransactionId } from 'src/transactions/domain/aggregates/transaction/transaction-id.value';
import { TransactionType } from 'src/transactions/domain/enums/transaction-type.enum';
import { TransactionStatus } from 'src/transactions/domain/enums/transaction.status.enum';
import { TransactionFactory } from 'src/transactions/domain/factories/transaction.factory';
import { TransactionEntity } from 'src/transactions/infrastructure/persistence/entities/transaction.entity';
import { AccountIdFromValue } from 'src/transactions/infrastructure/persistence/values/account-id-from.value';
import { AccountIdToValue } from 'src/transactions/infrastructure/persistence/values/account-id-to.value';
import { AmountValue } from 'src/transactions/infrastructure/persistence/values/amount.value';
import { UserId } from 'src/users/domain/agreggates/user/user-id.value';
import { Transaction } from '../../domain/aggregates/transaction/transaction.entity';
import { TransferMoney } from '../messages/commands/transfer-money.command';
import { WithdrawMoney } from '../messages/commands/withdraw-money.command';

export class TransactionMapper {
  public static withdrawMoneyToDomain(command: WithdrawMoney, accountId: AccountId): Transaction {
    const amount: Money = Money.create(command.amount, Currency.SOLES);
    const auditTrail: AuditTrail = AuditTrail.from(
      command.createdAt != null ? command.createdAt : null,
      UserId.of(1),
      null,
      null
    );
    let transaction: Transaction = TransactionFactory.create(
      TransactionType.WITHDRAW, 
      TransactionStatus.STARTED, 
      accountId, 
      null, 
      amount,
      auditTrail);
    return transaction;
  }

  public static depositMoneyToDomain(command: WithdrawMoney, accountId: AccountId): Transaction {
    const amount: Money = Money.create(command.amount, Currency.SOLES);
    const auditTrail: AuditTrail = AuditTrail.from(
      command.createdAt != null ? command.createdAt : null,
      UserId.of(1),
      null,
      null
    );
    let transaction: Transaction = TransactionFactory.create(
      TransactionType.DEPOSIT, 
      TransactionStatus.STARTED, 
      accountId, 
      null, 
      amount,
      auditTrail);
    return transaction;
  }

  public static transferMoneyToDomain(command: TransferMoney, fromAccountId: AccountId, toAccountId: AccountId): Transaction {
    const amount: Money = Money.create(command.amount, Currency.SOLES);
    const auditTrail: AuditTrail = AuditTrail.from(
      command.createdAt != null ? command.createdAt : null,
      UserId.of(1),
      null,
      null
    );
    let transaction: Transaction = TransactionFactory.create(
      TransactionType.TRANSFER, 
      TransactionStatus.STARTED, 
      fromAccountId, 
      toAccountId,
      amount,
      auditTrail);
    return transaction;
  }

  public static domainToEntity(transaction: Transaction): TransactionEntity {
    const transactionEntity: TransactionEntity = new TransactionEntity();
    transactionEntity.type = transaction.getType();
    transactionEntity.status = transaction.getStatus();
    transactionEntity.accountIdFrom = AccountIdFromValue.from(transaction.getAccountFrom().getValue());
    transactionEntity.accountIdTo = transaction.getAccountTo() != null ? AccountIdToValue.from(transaction.getAccountTo().getValue()) : null;
    transactionEntity.amount = AmountValue.from(transaction.getAmount().getAmount(), transaction.getAmount().getCurrency());
    return transactionEntity;
  }

  public static entityToDomain(transactionEntity: TransactionEntity): Transaction {
    const amount: Money = Money.create(transactionEntity.amount.amount, transactionEntity.amount.currency);
    const auditTrail: AuditTrail = AuditTrail.from(
      transactionEntity.auditTrail.createdAt != null ? DateTime.fromString(transactionEntity.auditTrail.createdAt) : null,
      transactionEntity.auditTrail.createdBy != null ? UserId.of(transactionEntity.auditTrail.createdBy) : null,
      transactionEntity.auditTrail.updatedAt != null ? DateTime.fromString(transactionEntity.auditTrail.updatedAt) : null,
      transactionEntity.auditTrail.updatedBy != null ? UserId.of(transactionEntity.auditTrail.updatedBy) : null
    );
    const accountId: AccountId = AccountId.of(transactionEntity.accountIdFrom.value);
    const transactionId: TransactionId = TransactionId.of(transactionEntity.id);
    let transaction: Transaction = TransactionFactory.withId(
      transactionId,
      TransactionType.WITHDRAW, 
      TransactionStatus.STARTED, 
      accountId, 
      null, 
      amount,
      null);
    return transaction;
  }
}