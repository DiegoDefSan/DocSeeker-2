import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentRepository } from 'src/payments/domain/aggregates/payment/payment.repository';
import { CompletePayment } from '../../messages/commands/complete-payment.command';
import { TRANSACTION_REPOSITORY } from '../../../domain/aggregates/payment/payment.repository';
import { Inject } from '@nestjs/common';
import { Payment } from 'src/payments/domain/aggregates/payment/payment.entity';
import { DataSource } from 'typeorm';

@CommandHandler(CompletePayment)
export class CompletePaymentHandler implements ICommandHandler<CompletePayment> {
  constructor(
    private dataSource: DataSource,
    @Inject(TRANSACTION_REPOSITORY)
    private paymentRepository: PaymentRepository
  ) {
  }

  async execute(command: CompletePayment) {
    const paymentId: number = command.paymentId;
    let payment: Payment = await this.paymentRepository.getById(paymentId);
    if (payment == null) return false;
    payment.complete();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      payment = await this.paymentRepository.update(payment);
      await queryRunner.commitTransaction();
    } catch(err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return payment == null ? false : true;
  }
}