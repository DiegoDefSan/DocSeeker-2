import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositMoneyHandler } from './application/handlers/commands/deposit-money.handler';
import { PaymentsApplicationService } from './application/services/payments-application.service';
import { PaymentsController } from './interface/rest/payment.controller';
import { DepositMoneyValidator } from './application/validators/deposit-money.validator';
import { WithdrawMoneyValidator } from './application/validators/withdraw-money.validator';
import { TransferMoneyValidator } from './application/validators/transfer-money.validator';
import { WithdrawMoneyHandler } from './application/handlers/commands/withdraw-money.handler';
import { TransferMoneyHandler } from './application/handlers/commands/transfer-money.handler';
import { CompletePaymentHandler } from './application/handlers/commands/complete-payment.handler';
import { AccountEntity } from 'src/accounts/infrastructure/persistence/entities/account.entity';
import { PaymentEntity } from './infrastructure/persistence/entities/payment.entity';
import { PaymentEntityRepository } from './infrastructure/persistence/repositories/payment.repository';
import { TRANSACTION_REPOSITORY } from './domain/aggregates/payment/payment.repository';
import { ACCOUNT_REPOSITORY } from 'src/accounts/domain/aggregates/account/account.repository';
import { AccountEntityRepository } from 'src/accounts/infrastructure/persistence/repositories/account.repository';

export const CommandHandlers = [DepositMoneyHandler, WithdrawMoneyHandler, TransferMoneyHandler, CompletePaymentHandler];
export const EventHandlers = [];
export const QueryHandlers = [];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([PaymentEntity, AccountEntity]),
  ],
  controllers: [PaymentsController],
  providers: [
    { useClass: AccountEntityRepository, provide: ACCOUNT_REPOSITORY },
    { useClass: PaymentEntityRepository, provide: TRANSACTION_REPOSITORY },
    PaymentsApplicationService,
    DepositMoneyValidator,
    WithdrawMoneyValidator,
    TransferMoneyValidator,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers
  ]
})
export class PaymentsModule {}