import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TransferMoney } from '../../messages/commands/transfer-money.command';
import { Payment } from '../../../domain/aggregates/payment/payment.entity';
import { PaymentMapper } from '../../mappers/payment.mapper';
import { AccountRepository, ACCOUNT_REPOSITORY } from 'src/accounts/domain/aggregates/account/account.repository';
import { PaymentRepository, TRANSACTION_REPOSITORY } from 'src/payments/domain/aggregates/payment/payment.repository';
import { Inject } from '@nestjs/common';
import { Account } from 'src/accounts/domain/aggregates/account/account.root.entity';
import { DataSource } from 'typeorm';

@CommandHandler(TransferMoney)
export class TransferMoneyHandler
  implements ICommandHandler<TransferMoney> {
  constructor(
    private dataSource: DataSource,
    @Inject(ACCOUNT_REPOSITORY)
    private accountRepository: AccountRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private paymentRepository: PaymentRepository,
    private publisher: EventPublisher,
  ) {
  }

  async execute(command: TransferMoney) {
    const fromAccount: Account = await this.accountRepository.getByNumber(command.fromAccountNumber);
    const toAccount: Account = await this.accountRepository.getByNumber(command.toAccountNumber);
    if (fromAccount == null) return null;
    if (toAccount == null) return null;
    let payment: Payment = PaymentMapper.transferMoneyToDomain(command, fromAccount.getId(), toAccount.getId());
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      payment = await this.paymentRepository.create(payment);
      if (payment == null) throw new Error("");
      payment = this.publisher.mergeObjectContext(payment);
      payment.transfer();
      payment.commit();
      await queryRunner.commitTransaction();
    } catch(err) {
      await queryRunner.rollbackTransaction();
      payment = null;
    } finally {
      await queryRunner.release();
    }
    return payment;
  }
}