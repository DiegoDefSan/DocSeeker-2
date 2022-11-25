import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DepositMoney } from '../../messages/commands/deposit-money.command';
import { Payment } from '../../../domain/aggregates/payment/payment.entity';
import { PaymentMapper } from '../../mappers/payment.mapper';
import { AccountRepository, ACCOUNT_REPOSITORY } from 'src/accounts/domain/aggregates/account/account.repository';
import { Inject } from '@nestjs/common';
import { PaymentRepository, TRANSACTION_REPOSITORY } from 'src/payments/domain/aggregates/payment/payment.repository';
import { Account } from 'src/accounts/domain/aggregates/account/account.root.entity';
import { DataSource } from 'typeorm';

@CommandHandler(DepositMoney)
export class DepositMoneyHandler implements ICommandHandler<DepositMoney> {
  constructor(
    private dataSource: DataSource,
    @Inject(ACCOUNT_REPOSITORY)
    private accountRepository: AccountRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private paymentRepository: PaymentRepository,
    private publisher: EventPublisher,
  ) {
  }

  async execute(command: DepositMoney) {
    const account: Account = await this.accountRepository.getByNumber(command.accountNumber);
    if (account == null) return null;
    let payment: Payment = PaymentMapper.depositMoneyToDomain(command, account.getId());
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      payment = await this.paymentRepository.create(payment);
      if (payment == null) throw new Error("");
      payment = this.publisher.mergeObjectContext(payment);
      payment.deposit();
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