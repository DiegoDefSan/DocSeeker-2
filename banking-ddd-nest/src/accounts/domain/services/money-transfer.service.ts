import { Account } from '../aggregates/account/account.root.entity';
import { Money } from '../../../shared/domain/values/money.value';
import { Result } from 'typescript-result';
import { AppNotification } from 'src/shared/application/app.notification';

export class MoneyTransferService {
  public transfer(fromAccount: Account, toAccount: Account, amount: Money): boolean {
    const withdrawResult: Result<AppNotification, Account> = fromAccount.withdraw(amount);
    const depositResult: Result<AppNotification, Account> = toAccount.deposit(amount);
    if (withdrawResult.isFailure() || depositResult.isFailure()) {
      console.log('MoneyTransferred error');
      return false;
    }
    return true;
  }
}